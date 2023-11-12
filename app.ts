import https from 'https';
import fs from 'fs';
import url from 'url';
import qs from 'querystring';
import ejs from 'ejs';


import * as mClass from './pages/_clases';


function go_run() {

  const options = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem'),
  };


  https.createServer(options, async (req, res) => {

    let body = '';

    req.on('error', err => {
      console.error("ERROR REQ:", JSON.stringify(err));
    });

    req.on('data', function (data) {

      //      console.log("event ON ", req.method, req.url, body);

      body += data;
      if (body.length > 1e6) {
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
        // return throw.console.error();
        // req.connection.destroy();
        return;
      }
    });


    req.on('end', async function () {

      //      console.log("event END ", req.method, req.url, body);

      const param_obj: mClass.RouteParam = {
        method: "" + req.method,
        url: "" + req.url,
        pathname: "",
        user: {id:0, name:'', aid:0},
        arg: {},
      };


      const url_obj = url.parse("" + req.url, true);
      param_obj.pathname = "" + url_obj.pathname;

      if (req.method === 'GET') {
        param_obj.arg = url_obj.query;
      }
      else  {
        param_obj.arg = qs.parse(body);
      }


      const cookie_str = req.headers.cookie || '';
      param_obj.user = mClass.GetUser_FromCookies(cookie_str);

      if (!param_obj.user.aid) {
        param_obj.user.aid = new Date().getTime();
      }


      console.log("param_obj: ", JSON.stringify(param_obj));


      if (param_obj.pathname.includes('/api/v1')) {

        const srvAPIRoute = new Map();
        srvAPIRoute.set('/api/v1/user', './api_v1/user');
        srvAPIRoute.set('/api/v1/cart', './api_v1/cart')

        let a_body = "";
        if (srvAPIRoute.has(param_obj.pathname)) {

          try {
            const v_route = await import(srvAPIRoute.get(param_obj.pathname));
            a_body = await v_route.get_body(param_obj);

          } catch (_err) {
            console.error("srvAPIRoute", _err);
          }
        } else {
          a_body = "srvAPIRoute: Data not found";
        }


        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.write(JSON.stringify(a_body));
        res.end();
        return;

      }



      const srvRoute = new Map();
      srvRoute.set('/', './pages/home');
      srvRoute.set('/about', './pages/about');
      srvRoute.set('/product', './pages/product');
      srvRoute.set('/product_edit', './pages/product_edit');
      srvRoute.set('/init', './pages/init');
      srvRoute.set('/product_view', './pages/product_view');
      srvRoute.set('/cart', './pages/cart');
      srvRoute.set('/carthist', './pages/carthistory');


      const defaultPage = await import("./pages/_default.js");
      let a_page = await defaultPage.getPage(param_obj);

      let a_body = "";

      if (srvRoute.has(param_obj.pathname)) {

        try {
          const v_route = await import(srvRoute.get(param_obj.pathname));
          a_body = await v_route.get_body(param_obj);

        } catch (_err) {
          a_body = (_err as Error).message;
          console.error("srvRoute", _err);
        }

      } else {
        a_body = "Page not found";

      }

      const result = ejs.render(a_page, {glBody: a_body});

      res.writeHead(200, { 
        'Content-Type': 'text/html; charset=utf-8' , 
        'Set-Cookie': mClass.anon_GetCookies_FromUser(param_obj.user.aid)
      });
      res.write(result);
      res.end();
      return;


    });


    //console.log("event END END ", req.method, req.url, body);


  }).listen(8000);

}



console.log("Server: Start");
go_run();
console.log("Server: Exit");

