import { mDB } from './db_module.js';

import https from 'https';
import fs from 'fs';
import path from 'path';
//import { open } from 'fs/promises';
//import {BodyParser}  from 'body-parser'




import { defaultPage } from "./pages/_default.js";



import url from 'url';
import qs from 'querystring';





function go_run() {

  const options = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem'),
  };


  https.createServer(options, async (req, res) => {


    let body = '';
    req.on('data', function (data) {
      body += data;
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
        // return throw.console.error();
        return;
        // req.connection.destroy();
      }
      console.log("event ON ", req.method, req.url, body);
    });

    req.on('end', async function () {

      console.log("event END ", req.method, req.url, body);

      let param_obj = {
        method: req.method,
        url: req.url,
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
          console.log('Static resourse: ', __dirname, filePath, ext);

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
                  console.log('static --------------HZ', err.message);
                  return;
                }
                res.writeHead(200, { "Content-Type": contentType });
                res.end(content);
                //console.log('static --------------OK');
                return;
              });
          });
          //console.log('gggggggggggggggggggg');
          return;
        }
      }


      const srvRoute = new Map();
      srvRoute.set('/', './pages/home');
      srvRoute.set('/about', './pages/about');
      srvRoute.set('/product', './pages/product');
      srvRoute.set('/init', './pages/init');

      if (srvRoute.has(param_obj.pathname)) {

        const v_route = await import(srvRoute.get(param_obj.pathname));
        //const a_body = v_route.getBodyPages();      // работает
        const page_obj = new v_route.BodyPage(param_obj);
        const a_body = page_obj.get_body();
        page_obj.destroy();
        //delete page_obj;


        const a_page_obj = new defaultPage({ "url_obj": url_obj, "method": req.method , "param_obj": param_obj});
        let a_page = a_page_obj.getPage();
        
        

        a_page = a_page.replace("[glMidRight]", a_body);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write(a_page);
        res.end();
        return;

      }
    });


    // res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    // res.write('ku-ku ' + JSON.stringify(url_obj));
    // res.end();

    //console.log("NOT NOT", req.url);

  }).listen(8000);

}



console.log("Server: Start");
go_run();
console.log("Server: Exit");

