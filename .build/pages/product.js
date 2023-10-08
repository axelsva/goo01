"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_body = void 0;
function get_body(param_obj) {
    return `
        <h1>Product page</h1>
        <div class='debug'>${JSON.stringify(param_obj)}</div>
        <form action="/product?action=create" method="GET">
        <input type="text" name="answer" value="a2">Операционная система<Br>
            <p><input type="submit"></p>
            <p><button formaction="/about">Отправить2</button></p>
            <button value=4  type="submit" name="Btn" formaction="/product">knBtn2</button>
        </form>
        `;
}
exports.get_body = get_body;
