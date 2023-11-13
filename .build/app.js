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
const http_1 = __importDefault(require("http"));
//import fs from 'fs';
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
const ejs_1 = __importDefault(require("ejs"));
const mClass = __importStar(require("./pages/_clases"));
function go_run() {
    http_1.default.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
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
        req.on('end', function () {
            return __awaiter(this, void 0, void 0, function* () {
                //      console.log("event END ", req.method, req.url, body);
                const param_obj = {
                    method: "" + req.method,
                    url: "" + req.url,
                    pathname: "",
                    user: { id: 0, name: '', aid: 0 },
                    arg: {},
                };
                const url_obj = url_1.default.parse("" + req.url, true);
                param_obj.pathname = "" + url_obj.pathname;
                if (req.method === 'GET') {
                    param_obj.arg = url_obj.query;
                }
                else {
                    param_obj.arg = querystring_1.default.parse(body);
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
                    srvAPIRoute.set('/api/v1/cart', './api_v1/cart');
                    let a_body = "";
                    if (srvAPIRoute.has(param_obj.pathname)) {
                        try {
                            const v_route = yield Promise.resolve(`${srvAPIRoute.get(param_obj.pathname)}`).then(s => __importStar(require(s)));
                            a_body = yield v_route.get_body(param_obj);
                        }
                        catch (_err) {
                            console.error("srvAPIRoute", _err);
                        }
                    }
                    else {
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
                const defaultPage = yield Promise.resolve().then(() => __importStar(require("./pages/_default.js")));
                let a_page = yield defaultPage.getPage(param_obj);
                let a_body = "";
                if (srvRoute.has(param_obj.pathname)) {
                    try {
                        const v_route = yield Promise.resolve(`${srvRoute.get(param_obj.pathname)}`).then(s => __importStar(require(s)));
                        a_body = yield v_route.get_body(param_obj);
                    }
                    catch (_err) {
                        a_body = _err.message;
                        if (a_body === 'db_CartToOrder') {
                            res.writeHead(301, { 'Location': '/carthist' });
                            res.end();
                            return;
                        }
                        console.error("srvRoute", _err);
                    }
                }
                else {
                    a_body = "Page not found";
                }
                const result = ejs_1.default.render(a_page, { glBody: a_body });
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Set-Cookie': mClass.anon_GetCookies_FromUser(param_obj.user.aid)
                });
                res.write(result);
                res.end();
                return;
            });
        });
        //console.log("event END END ", req.method, req.url, body);
    })).listen(8000);
}
console.log("Server: Start");
go_run();
console.log("Server: Exit");
