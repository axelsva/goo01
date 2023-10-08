"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_body = void 0;
function get_body(param_obj) {
    return `
        <h1>HOME page</h1>
        <div class='debug'>${JSON.stringify(param_obj)}</div>
        `;
}
exports.get_body = get_body;
