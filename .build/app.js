"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = require("./db_module.js");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
//import { open } from 'fs/promises';
//import {BodyParser}  from 'body-parser'
const _default_js_1 = require("./pages/_default.js");
const url_1 = __importDefault(require("url"));
function go_run() {
    console.log("go_rungo_rungo_rungo_rungo_rungo_run");
    const options = {
        key: fs_1.default.readFileSync('./key/key.pem'),
        cert: fs_1.default.readFileSync('./key/cert.pem'),
    };
    https_1.default.createServer(options, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const url_obj = url_1.default.parse("" + req.url, true);
        console.log(JSON.stringify(url_obj));
        //static resource
        const action = "" + url_obj.pathname;
        // Path Refinements
        const filePath = path_1.default.join(__dirname, action).split("%20").join(" ");
        //let filePath = path.join('.', action).split("%20").join(" ");
        const ext = path_1.default.extname(action);
        //filePath = "./assets/img/imgTop.png";
        console.log('FP ---', __dirname, filePath, ext);
        if (ext) {
            console.log('static --------------');
            // Checking if the path exists
            fs_1.default.exists(filePath, function (exists) {
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
                    case '.png':
                        contentType = 'image/png';
                        break;
                    case '.jpg':
                        contentType = 'image/jpg';
                        break;
                    case '.jpeg':
                        contentType = 'image/jpeg';
                        break;
                    case '.gif':
                        contentType = 'image/gif';
                        break;
                    case '.css':
                        contentType = 'text/css';
                        break;
                }
                // Reading the file
                fs_1.default.readFile(filePath, function (err, content) {
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
            const v_route = yield Promise.resolve(`${srvRoute.get(url_obj.pathname)}`).then(s => __importStar(require(s)));
            //const a_body = v_route.getBodyPages();      // работает
            const page_obj = new v_route.BodyPage(url_obj.pathname);
            const a_body = page_obj.get_body();
            const a_page_obj = new _default_js_1.defaultPage({ "url_obj": url_obj, "method": req.method });
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
    })).listen(8000);
}
console.log("Server: Start");
go_run();
console.log("Server: Exit");
db_module_js_1.mDB.closeDb();
console.log("END");
