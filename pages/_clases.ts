export interface RouteParam {
    method: string,
    url: string,
    pathname: string,
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
    salt: string,
    hash: string,
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


export function NewUserFromArray(a_user: object) {
    const User = {} as TUser;

    if ('id' in a_user) {
        User.ID = a_user.id as number
    }

    if ('name' in a_user) {
        User.name = a_user.name as string
    }

    if ('psw' in a_user) {
        User.salt = "1";
        User.hash = "2";
    }

    return User;
}

