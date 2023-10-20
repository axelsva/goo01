"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidate = exports.NewProductFromArray = exports.get_html_a_product = exports.get_html_a = void 0;
function get_html_a(text, href) {
    return `<a href="${href}">${text}</a>`;
}
exports.get_html_a = get_html_a;
function get_html_a_product(a_product) {
    return `<a href="/product_edit?id=${a_product.ID}">ID: ${a_product.ID} </a> Name: ${a_product.name}`;
}
exports.get_html_a_product = get_html_a_product;
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
