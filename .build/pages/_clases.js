"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewUserFromArray = exports.GetUser_FromCookies = exports.GetCookies_FromUser = exports.GetCookies_NULLUser = exports.validPassword = exports.setPassword = exports.ProductValidate = exports.NewProductFromArray = exports.get_html_product_img = exports.get_html_a_product = exports.get_html_a = void 0;
const crypto_1 = __importDefault(require("crypto"));
const cookie = require("cookie");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function get_html_a(text, href) {
    return `<a href="${href}">${text}</a>`;
}
exports.get_html_a = get_html_a;
function get_html_a_product(a_product) {
    return `<a href="/product_edit?id=${a_product.ID}">ID: ${a_product.ID} </a> Name: ${a_product.name}`;
}
exports.get_html_a_product = get_html_a_product;
function get_html_product_img(a_id) {
    const a_num = a_id || 0;
    const fp = `/upload/${a_num}.jpg`;
    let stub = "/upload/stub.jpg";
    const filePath = path_1.default.join(__dirname, '..' + fp);
    console.log("fp", filePath);
    try {
        fs_1.default.openSync(filePath, 'r');
        stub = fp;
    }
    catch (_e) { }
    console.log("fp", stub);
    return "" + stub;
}
exports.get_html_product_img = get_html_product_img;
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
    return cookie.serialize('s_uid', "", { maxAge: 0 });
}
exports.GetCookies_NULLUser = GetCookies_NULLUser;
function GetCookies_FromUser(a_id, a_name) {
    const user_obj = { "id": a_id, "name": a_name };
    const enc_text = new TextEncoder().encode(JSON.stringify(user_obj));
    return cookie.serialize('s_uid', enc_text.toString(), { maxAge: 600 });
}
exports.GetCookies_FromUser = GetCookies_FromUser;
function GetUser_FromCookies(a_cookies) {
    //console.log(a_cookies);
    const cookies = cookie.parse(a_cookies);
    if (cookies && 's_uid' in cookies) {
        try {
            const str = cookies.s_uid;
            const str1 = str.split(',');
            const uArr = Uint8Array.from(str1, (x) => { return parseInt(x, 10); });
            const dec_obj = JSON.parse(new TextDecoder("utf-8").decode(uArr));
            console.log("dec_obj", dec_obj);
            return dec_obj || {};
        }
        catch (_a) {
            return {};
        }
    }
    return {};
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
