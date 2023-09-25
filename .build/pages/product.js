"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyPage = void 0;
class BodyPage {
    constructor(a_url) {
        this.srv_url = a_url;
    }
    get_body() {
        return `<h1>Product page: ${this.srv_url}</h1>`;
    }
}
exports.BodyPage = BodyPage;
