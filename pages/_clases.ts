
import crypto from 'crypto';
import cookie from 'cookie';
import fs from 'fs';
import path from 'path';

export const app_cfg = new Map();
app_cfg.set('site_name', 'Goo Goo Goo');
app_cfg.set('site_tel', '8-800-700-8888');
app_cfg.set('RUR', 'руб');
app_cfg.set('cookie_user_max_age', 1200);   //20 min



export interface RouteParam {
    method: string,
    url: string,
    pathname: string,
    user: {id:number, name: string, aid: number},
    arg: object,
}

export interface Product {
    ID: number;
    name: string,
    articul: string,
    description: string,
    price: number,
    src: string,
    RUR: string
}

export interface User {
    ID: number;
    name: string,
    psw: string,
    salt: string,
    hash: string
}

export interface CartItem {
    ID: number;
    id_user: number,
    id_product: number,
    sum: number,
    name: string,
    mtime: Date,
    src: string,
    RUR: string
}

//{"email":"test@ya.ru","tel":"","comment":"","address":"Киров, улица Горького, 18","d_sum":"500","btn":"cmd_order"}}

export interface ParamOrder {
    user: string;
    email: string,
    tel: string,
    comment: string,
    address: number,
    order_summ: number,
    d_sum: number
}




export function get_html_a(text: string, href: string) {
    const str = `<a href="${href}">${text}</a>`;
    return str;
}

export function get_html_a_product(a_product: Product) {
    return `<a href="/product_edit?id=${a_product.ID}">ID: ${a_product.ID} </a> Name: ${a_product.name}`;
}


export function get_html_product_img(a_id: number) {
//    const stub = "/upload/stub.jpg";
    const stub = "/upload/stub.jpg";
    let result = "" + stub;

    const a_num = a_id as number || 0;
    const fp = `/upload/${a_num}.jpg`;
    const filePath = path.join(__dirname, '../.build' + fp);


    // check exist file
    try {
        fs.openSync(filePath, 'r');
        result = fp;
    }
    catch {
        //console.log("get_html_product_img");
    };


    //console.log("IMG", result);

    return result;
}


export function getIDUserRegistr(user_obj: object) {
    if ('id' in user_obj) {
        return (user_obj.id as number) || 0;
    }
    return 0;
}

export function getNameUserRegistr(user_obj: object) {
    if ('name' in user_obj) {
        return (user_obj.name as string) || '';
    }
    return '';
}

export function isRoleAdmin(user_obj: object) {
    if ('name' in user_obj) {
        return (user_obj.name === 'admin') ;
    }
    return false;    
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
    return cookie.serialize('s_uid', enc_text.toString(), { maxAge: app_cfg.get('cookie_user_max_age') });

}

export function anon_GetCookies_FromUser(a_id: number) {

    return cookie.serialize('a_uid', a_id.toString(), { maxAge: 60*60*24*365});

}

export function GetUser_FromCookies(a_cookies: string) {

    //console.log(a_cookies);
    const a_user = {
            id: 0,
            name: '',
            aid: 0
    };

    const cookies = cookie.parse(a_cookies);

    if (cookies && 's_uid' in cookies) {

        try {
            const str = cookies['s_uid'];
            const str1 = str.split(',');
            const uArr = Uint8Array.from(str1, (x) => { return parseInt(x, 10); });
            const dec_obj = JSON.parse(new TextDecoder("utf-8").decode(uArr));

            a_user.id = dec_obj.id;
            a_user.name = dec_obj.name;
        } catch {
           
        }
    }

    if (cookies && 'a_uid' in cookies) {

        try {
            a_user.aid = Number(cookies['a_uid']);

        } catch {
           
        }
    }

    console.log("a_user", a_user);
    return a_user;
}



export function NewUserFromArray(a_user: object) {

    const User = {} as User;

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

export function validate_param_order(param_obj: object) {

    //{"email":"test@ya.ru","tel":"","comment":"","address":"Киров, улица Горького, 18","
    //  d_sum":"500","btn":"cmd_order"}}
    const result = param_obj as ParamOrder || {};

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

export function send_order(order_param: ParamOrder, rows: []) {

    let s_sum = 0;
    let s_item = '';

    rows.forEach((_row, ii) => {
        const row = _row as CartItem;
        s_sum += row.sum
        s_item += `\nITEM: ${ii} - Name: ${row.name}, ProdID: ${row.id_product}, Sum: ${row.sum} ${app_cfg.get('RUR')}`;

    });

    const s_date = `${new Date(Date.now()).toLocaleString()}`;

    let result = `
        Date:   ${s_date}
        User: ${order_param.user}
        Tel:  ${order_param.tel}
        Email:  ${order_param.email}
        Comment:  ${order_param.comment}
        Address:  ${order_param.address}
        Order Sum:  ${s_sum} ${app_cfg.get('RUR')}
        Delivery Sum:  ${order_param.d_sum} ${app_cfg.get('RUR')}
    `;

    result += s_item;

    console.log(result);


    const fp = `/upload/${order_param.user}-${Date.now()}.txt`;
    const filePath = path.join(__dirname, '../.build' + fp);

    fs.writeFileSync(filePath, result, 'utf8');

    return fp;
}

