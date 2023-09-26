import { mDB } from './db_module.js';

import https from 'https';
import fs from 'fs';
import path from 'path';
//import { open } from 'fs/promises';
//import {BodyParser}  from 'body-parser'




import { defaultPage } from "./pages/_default.js";



import url from 'url';


function go_run() {

  console.log("go_rungo_rungo_rungo_rungo_rungo_run")

  const options = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem'),
  };


  https.createServer(options, async (req, res) => {

    const url_obj = url.parse("" + req.url, true);
    console.log(JSON.stringify(url_obj));


    //static resource

    const action = "" + url_obj.pathname;

    // Path Refinements
    const filePath = path.join(__dirname, action).split("%20").join(" ");
    //let filePath = path.join('.', action).split("%20").join(" ");

    const ext = path.extname(action);
    //filePath = "./assets/img/imgTop.png";
    console.log('FP ---', __dirname, filePath, ext);


    if (ext) {
      console.log('static --------------');
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
          case '.css' : contentType = 'text/css'; break;
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
            console.log('static --------------OK');
            return;
          });
      });
      console.log('gggggggggggggggggggg');
      return;
    }


    const srvRoute = new Map();
    srvRoute.set('/', './pages/home');
    srvRoute.set('/about', './pages/about');
    srvRoute.set('/product', './pages/product');

    if (srvRoute.has(url_obj.pathname)) {

      const v_route = await import(srvRoute.get(url_obj.pathname));
      //const a_body = v_route.getBodyPages();      // работает
      const page_obj = new v_route.BodyPage(url_obj.pathname);
      const a_body = page_obj.get_body();


      const a_page_obj = new defaultPage({ "url_obj": url_obj, "method": req.method });
      let a_page = a_page_obj.getPage();

      a_page = a_page.replace("[glMidRight]", a_body);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write(a_page);
      res.end();
      return;

    }



    // res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    // res.write('ku-ku ' + JSON.stringify(url_obj));
    // res.end();

    //console.log("NOT NOT", req.url);

  }).listen(8000);

}



console.log("Server: Start");
go_run();
console.log("Server: Exit");


mDB.closeDb();

console.log("END");