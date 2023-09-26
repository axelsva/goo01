"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyPage = void 0;
class BodyPage {
    constructor(a_url) {
        this.srv_url = a_url;
    }
    get_body() {
        return `
        <h1>Product page: ${this.srv_url}</h1>
        <form action="/product?action=create" method="GET">
        <input type="text" name="answer" value="a2">Операционная система<Br>
            <p><input type="submit"></p>
            <p><button formaction="/about">Отправить2</button></p>
        </form>
        `;
    }
}
exports.BodyPage = BodyPage;
