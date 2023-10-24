"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPage = void 0;
function getPage(param_obj) {
    const pageTemplate = `
    <head>
        <link rel="stylesheet" type="text/css" href="/assets/css/style.css">
        <script src="/assets/mscript.js"></script>
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
        const a_tel = "8-800-88-98=87";
        const result = `
        "ооо рога и копыта", tel:${a_tel}
        <a href="/"><img src="/assets/img/imgTop.gif" 
         width="100" height="100" alt="To home">home</a>
        <a href="/about"><img src="/assets/img/imgAbout.png" 
            width="100" height="100" alt="To About">about</a>
        <a href="/product?id=2">product</a>
        <a href="/init">init</a>
        `;
        return result;
    }
    function get_glMidLeft() {
        if (param_obj.user && 'id' in param_obj.user && 'name' in param_obj.user) {
            return `
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
            return `
            <div>
                <form name="form_reg" id="form_reg" action="/user" method="POST">
                    <label><input id="" type="hidden" name="id" value=""> </label><Br>
                    <label>User:<input type="text" name="name" value=""></label><Br>
                    <label>Psw:<input type="text" name="psw" value=""></label><Br>
                    <br>
                    <input id="btn_login" type="button" onclick="User_Login()" name="btn_enter"  value="Enter">
                    <input id="btn_reg" type="button" name="btn_reg"  value="Register">
                </form>
                <div id="reg_user_status"></div>
            </div>
            `;
        }
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
