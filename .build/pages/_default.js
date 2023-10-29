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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPage = void 0;
const mClass = __importStar(require("./_clases.js"));
//<link rel="stylesheet" href="/assets/css/mob_style.css" media="(max-width: 480px)">
function getPage(param_obj) {
    const pageTemplate = `
    <head>
        <link rel="stylesheet" type="text/css" href="/assets/css/style.css">
        <script src="/assets/mscript.js"></script>
        <meta name="viewport" content="width=device-width, user-scalable=yes">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=c37dd155-c946-4cbe-9c3d-4894dd90dc2c" type="text/javascript"></script>
        <script src="/assets/deliveryCalculator.js" type="text/javascript"></script>
        <style>
            #map {
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
                scroll: false;
            }
        </style>
    </head>
    <body>
        <div class="glMain">
            <div class="glTop">[glTop]</div>
            <div class="glMidle">
                <div class="glMidLeft ">[glMidLeft]</div>
                <div class="glMidRight">[glMidRight]</div>
            </div>
            <div class="glBottom">[glBottom]</div>
        </div>
    </body>
        `;
    function get_glTop() {
        const result = `
        <div id="glTop">
            <div id="glTop10">
                <div class="glTop1" id="glTop1"> "${mClass.app_cfg.get('site_name')}"  </div>
            </div>
            <div id="glTop20">
                <div class="glTop1" id="glTop3"> tel:${mClass.app_cfg.get('site_tel')} </div>    
            </div>         
        </div>
        `;
        return result;
    }
    function get_glMidLeft() {
        let result = '';
        if (param_obj.user && 'id' in param_obj.user && 'name' in param_obj.user) {
            result += `
            <div>
                <form name="form_reg" id="form_reg" action="/user" method="POST">
                    USER: ${param_obj.user.name}
                    <label><input id="${param_obj.user.id}" type="hidden" name="id" value=""> </label><Br>
                    <br>
                    <input id="btn_logout" type="button" name="btn_logout"  value="Logout">
                </form>
                <div id="reg_user_status"></div>
            </div>
            `;
        }
        else {
            result += `
            <div>
                <form name="form_reg" id="form_reg" action="/user" method="POST">
                    <label><input id="" type="hidden" name="id" value=""> </label><Br>
                    <label>User:<input type="text" name="name" value=""></label><Br>
                    <label>Psw:<input type="text" name="psw" value=""></label><Br>
                    <br>
                    <input id="btn_login" type="submit" onclick="User_Login()" name="btn_enter"  value="Enter">
                    <input id="btn_reg" type="button" name="btn_reg"  value="Register">
                </form>
                <div id="reg_user_status"></div>
            </div>
            `;
        }
        result += `
            <br>
            <div id="div_links">
                <hr>
                <div id="Cart">
                    ${mClass.get_html_a('Cart', '/cart')} </br>
                    <div id="CartStatus"> </div>
                </div>
                 <hr>
              
                    ${mClass.get_html_a('Home', '/')} </br>
                    ${mClass.get_html_a('About', '/about')} </br>
                    ${mClass.get_html_a('Products', '/product')} </br>
                    <hr>
                    ${mClass.get_html_a('Init', '/init')} </br>
          
            </div>
        `;
        return result;
    }
    function get_glMidRight() {
        return `[glMidRight]`;
    }
    function get_glBottom() {
        return `
            Это подвал:<br>
            ${JSON.stringify(param_obj)}
        `;
    }
    let a_page = pageTemplate;
    a_page = a_page.replace("[glTop]", get_glTop());
    a_page = a_page.replace("[glMidLeft]", get_glMidLeft());
    a_page = a_page.replace("[glMidRight]", get_glMidRight());
    a_page = a_page.replace("[glBottom]", get_glBottom());
    return a_page;
}
exports.getPage = getPage;
