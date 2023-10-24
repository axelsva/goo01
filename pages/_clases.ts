
import crypto from 'crypto';
import cookie = require("cookie");



export interface RouteParam {
    method: string,
    url: string,
    pathname: string,
    user: object,
    arg: object,
}

export interface Product {
    ID: number;
    name: string,
    articul: string,
    description: string,
    price: number
}

export interface TUser {
    ID: number;
    name: string,
    psw: string,
    salt: string,
    hash: string
}


export function get_html_a(text: string, href: string) {
    return `<a href="${href}">${text}</a>`;
}

export function get_html_a_product(a_product: Product) {
    return `<a href="/product_edit?id=${a_product.ID}">ID: ${a_product.ID} </a> Name: ${a_product.name}`;
}



export function NewProductFromArray(a_product: object) {
    const product = {} as Product;

    if ('id' in a_product) {
        product.ID = a_product.id as number
    }

    if ('name' in a_product) {
        product.name = a_product.name as string
    }
    if ('articul' in a_product) {
        product.articul = a_product.articul as string
    }
    if ('description' in a_product) {
        product.description = a_product.description as string
    }
    if ('price' in a_product) {
        product.price = a_product.price as number
    }

    return product;
}


export function ProductValidate(a_product: Product) {

    const result = [];

    if (a_product.name.length < 3) {
        result.push('Error: Length product name must be more than 2 characters');
    }

    if (a_product.articul.length < 3) {
        result.push('Error: Length articule must be more than 2 characters');
    }

    return result;
}


// Method to set salt and hash the password for a user 
export function setPassword(password: string) {

    // Creating a unique salt for a particular user 
    const salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations, 
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

    return { salt, hash }
}

// Method to check the entered password is correct or not 
export function validPassword(password: string, salt: string, hash: string) {
    const nhash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return nhash === hash;
}

export function GetCookies_NULLUser() {

    return cookie.serialize('s_uid', "", { maxAge: 0 });

}

export function GetCookies_FromUser(a_id: number, a_name: string) {

    const user_obj = { "id": a_id, "name": a_name };
    const enc_text = new TextEncoder().encode(JSON.stringify(user_obj));
    return cookie.serialize('s_uid', enc_text.toString(), { maxAge: 600 });

}

export function GetUser_FromCookies(a_cookies: string) {

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

        } catch {
            return {};
        }
    }
    return {};
}



export function NewUserFromArray(a_user: object) {

    const User = {} as TUser;

    if ('id' in a_user) {
        User.ID = a_user.id as number;
    }

    if (('name' in a_user) && (a_user.name as string).length > 3) {
        User.name = a_user.name as string;
    } else
        throw new Error('Error: wrong user name');

    if (('psw' in a_user) && (a_user.psw as string).length > 3) {
        User.psw = a_user.psw as string;
    } else
        throw new Error('Error: wrong user password');

    return User;
}

