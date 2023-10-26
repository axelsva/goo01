

import https from 'https';
import fs from 'fs';
import path from 'path';
import url from 'url';
import qs from 'querystring';

import * as mClass from './pages/_clases.js';

const gl_user = {} as mClass.TUser;


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
        user: {},
        arg: {},
      };


      const url_obj = url.parse("" + req.url, true);
      param_obj.pathname = "" + url_obj.pathname;

      if (req.method === 'POST') {
        param_obj.arg = qs.parse(body);
      }
      else if (req.method === 'GET') {
        param_obj.arg = url_obj.query;
      }
      else if (req.method === 'PUT') {
        param_obj.arg = qs.parse(body);
      }
      else if (req.method === 'DEL') {
        param_obj.arg = qs.parse(body);
      }

      console.log("param_obj: ", JSON.stringify(param_obj));

      // static resourse/file
      if (param_obj.method === 'GET') {

        const filePath = path.join(__dirname, param_obj.pathname).split("%20").join(" ");
        const ext = path.extname(param_obj.pathname);

        if (ext) {
          //console.log('Static resourse: ', __dirname, filePath, ext);

          try {
            // Setting default Content-Type
            let contentType = "text/plain";

            switch (ext) {
              case '.png': contentType = 'image/png'; break;
              case '.jpg': contentType = 'image/jpg'; break;
              case '.jpeg': contentType = 'image/jpeg'; break;
              case '.gif': contentType = 'image/gif'; break;
              case '.css': contentType = 'text/css'; break;
            }

            // Reading the file
            const content = fs.readFileSync(filePath);
            if (content) {
              res.writeHead(200, { "Content-Type": contentType });
              res.end(content);
              //console.log('static --------------OK');
              return;

            } else {

              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
              console.log('static 404 Not Found', filePath);
              return;

            }

          }

          catch (_err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
            console.log('static2 404 Not Found', (_err as Error).message);
            return;

          }
        }
      }


      const cookie_str = req.headers.cookie || '';
      param_obj.user = mClass.GetUser_FromCookies(cookie_str);


      if (param_obj.pathname.includes('/api/v1')) {

        const srvAPIRoute = new Map();
        srvAPIRoute.set('/api/v1/user', './api_v1/user');
        srvAPIRoute.set('/api/v1/cart', './api_v1/cart')

        let a_body = "";
        if (srvAPIRoute.has(param_obj.pathname)) {

          try {
            const v_route = await import(srvAPIRoute.get(param_obj.pathname));
            a_body = await v_route.get_body(param_obj);

          } catch (_e) {
            const e = _e as Error;
            a_body = e.message;
            console.log("srvAPIRoute", JSON.stringify(e));
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

      let a_page = "";
      const defaultPage = await import("./pages/_default.js");
      a_page = await defaultPage.getPage(param_obj);

      let a_body = "";
      if (srvRoute.has(param_obj.pathname)) {

        try {
          const v_route = await import(srvRoute.get(param_obj.pathname));
          a_body = await v_route.get_body(param_obj);

        } catch (_e) {
          const e = _e as Error;
          a_body = e.message;
          console.log("srvRoute", JSON.stringify(e));
        }

      } else {
        a_body = "Page not found";

      }

      a_page = a_page.replace("[glMidRight]", a_body);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write(a_page);
      res.end();
      return;


    });


    //console.log("event END END ", req.method, req.url, body);


  }).listen(8000);

}



console.log("Server: Start");
go_run();
console.log("Server: Exit");

