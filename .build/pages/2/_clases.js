"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_order = exports.validate_param_order = exports.NewUserFromArray = exports.GetUser_FromCookies = exports.anon_GetCookies_FromUser = exports.GetCookies_FromUser = exports.GetCookies_NULLUser = exports.validPassword = exports.setPassword = exports.ProductValidate = exports.NewProductFromArray = exports.isRoleAdmin = exports.getNameUserRegistr = exports.getIDUserRegistr = exports.get_html_product_img = exports.get_html_a_product = exports.get_html_a = exports.app_cfg = void 0;
const crypto_1 = __importDefault(require("crypto"));
const cookie_1 = __importDefault(require("cookie"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.app_cfg = new Map();
exports.app_cfg.set('site_name', 'Goo Goo Goo');
exports.app_cfg.set('site_tel', '8-800-700-8888');
exports.app_cfg.set('RUR', 'руб');
exports.app_cfg.set('cookie_user_max_age', 1200); //20 min
function get_html_a(text, href) {
    const str = `<a href="${href}">${text}</a>`;
    return str;
}
exports.get_html_a = get_html_a;
function get_html_a_product(a_product) {
    return `<a href="/product_edit?id=${a_product.ID}">ID: ${a_product.ID} </a> Name: ${a_product.name}`;
}
exports.get_html_a_product = get_html_a_product;
function get_html_product_img(a_id) {
    const stub = "/upload/stub.jpg";
    let result = "" + stub;
    const a_num = a_id || 0;
    const fp = `/upload/${a_num}.jpg`;
    const filePath = path_1.default.join(__dirname, '..' + fp);
    // check exist file
    try {
        fs_1.default.openSync(filePath, 'r');
        result = fp;
    }
    catch (_a) {
        //console.log("get_html_product_img");
    }
    ;
    return result;
}
exports.get_html_product_img = get_html_product_img;
function getIDUserRegistr(user_obj) {
    if ('id' in user_obj) {
        return user_obj.id || 0;
    }
    return 0;
}
exports.getIDUserRegistr = getIDUserRegistr;
function getNameUserRegistr(user_obj) {
    if ('name' in user_obj) {
        return user_obj.name || '';
    }
    return '';
}
exports.getNameUserRegistr = getNameUserRegistr;
function isRoleAdmin(user_obj) {
    if ('name' in user_obj) {
        return (user_obj.name === 'admin');
    }
    return false;
}
exports.isRoleAdmin = isRoleAdmin;
function NewProductFromArray(a_product) {
    const product = {};
    if ('id' in a_product) {
        product.ID = a_product.id;
    }
    if ('name' in a_product) {
        product.name = a_product.name;
    }
    if ('articul' in a_product) {
        product.articul = a_product.articul;
    }
    if ('description' in a_product) {
        product.description = a_product.description;
    }
    if ('price' in a_product) {
        product.price = a_product.price;
    }
    return product;
}
exports.NewProductFromArray = NewProductFromArray;
function ProductValidate(a_product) {
    const result = [];
    if (a_product.name.length < 3) {
        result.push('Error: Length product name must be more than 2 characters');
    }
    if (a_product.articul.length < 3) {
        result.push('Error: Length articule must be more than 2 characters');
    }
    return result;
}
exports.ProductValidate = ProductValidate;
// Method to set salt and hash the password for a user 
function setPassword(password) {
    // Creating a unique salt for a particular user 
    const salt = crypto_1.default.randomBytes(16).toString('hex');
    // Hashing user's salt and password with 1000 iterations, 
    const hash = crypto_1.default.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return { salt, hash };
}
exports.setPassword = setPassword;
// Method to check the entered password is correct or not 
function validPassword(password, salt, hash) {
    const nhash = crypto_1.default.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return nhash === hash;
}
exports.validPassword = validPassword;
function GetCookies_NULLUser() {
    return cookie_1.default.serialize('s_uid', "", { maxAge: 0 });
}
exports.GetCookies_NULLUser = GetCookies_NULLUser;
function GetCookies_FromUser(a_id, a_name) {
    const user_obj = { "id": a_id, "name": a_name };
    const enc_text = new TextEncoder().encode(JSON.stringify(user_obj));
    return cookie_1.default.serialize('s_uid', enc_text.toString(), { maxAge: exports.app_cfg.get('cookie_user_max_age') });
}
exports.GetCookies_FromUser = GetCookies_FromUser;
function anon_GetCookies_FromUser(a_id) {
    return cookie_1.default.serialize('a_uid', a_id.toString(), { maxAge: 60 * 60 * 24 * 365 });
}
exports.anon_GetCookies_FromUser = anon_GetCookies_FromUser;
function GetUser_FromCookies(a_cookies) {
    //console.log(a_cookies);
    const a_user = {
        id: 0,
        name: '',
        aid: 0
    };
    const cookies = cookie_1.default.parse(a_cookies);
    if (cookies && 's_uid' in cookies) {
        try {
            const str = cookies['s_uid'];
            const str1 = str.split(',');
            const uArr = Uint8Array.from(str1, (x) => { return parseInt(x, 10); });
            const dec_obj = JSON.parse(new TextDecoder("utf-8").decode(uArr));
            a_user.id = dec_obj.id;
            a_user.name = dec_obj.name;
        }
        catch (_a) {
        }
    }
    if (cookies && 'a_uid' in cookies) {
        try {
            a_user.aid = Number(cookies['a_uid']);
        }
        catch (_b) {
        }
    }
    console.log("a_user", a_user);
    return a_user;
}
exports.GetUser_FromCookies = GetUser_FromCookies;
function NewUserFromArray(a_user) {
    const User = {};
    if ('id' in a_user) {
        User.ID = a_user.id;
    }
    if (('name' in a_user) && a_user.name.length > 3) {
        User.name = a_user.name;
    }
    else
        throw new Error('Error: wrong user name');
    if (('psw' in a_user) && a_user.psw.length > 3) {
        User.psw = a_user.psw;
    }
    else
        throw new Error('Error: wrong user password');
    return User;
}
exports.NewUserFromArray = NewUserFromArray;
function validate_param_order(param_obj) {
    //{"email":"test@ya.ru","tel":"","comment":"","address":"Киров, улица Горького, 18","
    //  d_sum":"500","btn":"cmd_order"}}
    const result = param_obj || {};
    if (!result.email) {
        throw new Error('Error: order email is empty');
    }
    if (!result.tel) {
        throw new Error('Error: order tel is empty');
    }
    if (!result.address) {
        throw new Error('Error: order address is empty');
    }
    return result;
}
exports.validate_param_order = validate_param_order;
function send_order(order_param, rows) {
    let s_sum = 0;
    let s_item = '';
    rows.forEach((_row, ii) => {
        const row = _row;
        s_sum += row.sum;
        s_item += `\nITEM: ${ii} - Name: ${row.name}, ProdID: ${row.id_product}, Sum: ${row.sum} ${exports.app_cfg.get('RUR')}`;
    });
    const s_date = `${new Date(Date.now()).toLocaleString()}`;
    let result = `
        Date:   ${s_date}
        User: ${order_param.user}
        Tel:  ${order_param.tel}
        Email:  ${order_param.email}
        Comment:  ${order_param.comment}
        Address:  ${order_param.address}
        Order Sum:  ${s_sum} ${exports.app_cfg.get('RUR')}
        Delivery Sum:  ${order_param.d_sum} ${exports.app_cfg.get('RUR')}
    `;
    result += s_item;
    console.log(result);
    const fp = `/upload/${order_param.user}-${Date.now()}.txt`;
    const filePath = path_1.default.join(__dirname, '..' + fp);
    fs_1.default.writeFileSync(filePath, result, 'utf8');
    return fp;
}
exports.send_order = send_order;
