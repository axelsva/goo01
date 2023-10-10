

import https from 'https';
import fs from 'fs';
import path from 'path';
import url from 'url';
import qs from 'querystring';

import * as mClass from './pages/_clases.js';



function go_run() {

  const options = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem'),
  };


  https.createServer(options, async (req, res) => {


    let body = '';

    req.on('error', err => {
      // This prints the error message and stack trace to `stderr`.
      console.error("ERROR", err, err.stack);
      console.error("ERROR2", JSON.stringify(err));
    });

    req.on('data', function (data) {

      //      console.log("event ON ", req.method, req.url, body);

      body += data;
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
        // return throw.console.error();
        return;
        // req.connection.destroy();
      }
    });

    req.on('end', async function () {

      //      console.log("event END ", req.method, req.url, body);

      let param_obj: mClass.RouteParam = {
        method: "" + req.method,
        url: "" + req.url,
        pathname: "",
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
      else {
        param_obj.arg = url_obj.query;
      }

      console.log("param_obj: ", JSON.stringify(param_obj));

      // static resourse
      if (param_obj.method === 'GET') {

        //let filePath = path.join('.', a_param.pathname).split("%20").join(" ");
        const filePath = path.join(__dirname, param_obj.pathname).split("%20").join(" ");
        const ext = path.extname(param_obj.pathname);

        if (ext) {
          //console.log('Static resourse: ', __dirname, filePath, ext);

          // Checking if the path exists
          fs.exists(filePath, function (exists) {

            // if (!exists) {
            //   res.writeHead(404, { "Content-Type": "text/plain" });
            //   res.end("404 Not Found");
            //   console.log('static --------------404');
            //   return;
            // }

            // Setting default Content-Type
            let contentType = "text/plain";

            // Checking if the extension of
            // image is '.png'
            switch (ext) {
              case '.png': contentType = 'image/png'; break;
              case '.jpg': contentType = 'image/jpg'; break;
              case '.jpeg': contentType = 'image/jpeg'; break;
              case '.gif': contentType = 'image/gif'; break;
              case '.css': contentType = 'text/css'; break;
            }

            // Reading the file
            fs.readFile(filePath,
              function (err, content) {
                if (err) {
                  res.writeHead(404, { "Content-Type": "text/plain" });
                  res.end("404 Not Found");
                  console.log('static 404 Not Found', err.message);
                  return;
                }
                res.writeHead(200, { "Content-Type": contentType });
                res.end(content);
                //console.log('static --------------OK');
                return;
              });
          });
          return;
        }
      }


      const srvRoute = new Map();
      srvRoute.set('/', './pages/home');
      srvRoute.set('/about', './pages/about');
      srvRoute.set('/product', './pages/product');
      srvRoute.set('/product_edit', './pages/product_edit');
      srvRoute.set('/init', './pages/init');
     

      if (srvRoute.has(param_obj.pathname)) {

        let a_body = "";
        try {
          const v_route =  await import(srvRoute.get(param_obj.pathname));
          a_body =  v_route.get_body(param_obj);
        } catch (_e) {
          const e = _e as Error;
          a_body = e.message;
          console.log("---------------------dfvdfvdf--------------------------------");
        }

        const defaultPage =  await import("./pages/_default.js");
        let a_page =  defaultPage.getPage({ "url_obj": url_obj, "method": req.method, "param_obj": param_obj });

        a_page = a_page.replace("[glMidRight]", a_body);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write(a_page);
        res.end();
        return;

      }
    });


    //console.log("event END END ", req.method, req.url, body);


  }).listen(8000);

}



console.log("Server: Start");
go_run();
console.log("Server: Exit");

