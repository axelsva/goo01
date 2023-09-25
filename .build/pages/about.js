"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyPage = exports.getBodyPages = void 0;
function getBodyPages(a_url) {
    const a_title = "ООО Рога " + a_url;
    return `<div><h1>About: ${a_title}</h1><div>`;
}
exports.getBodyPages = getBodyPages;
class BodyPage {
    constructor(a_url) {
        this.srv_url = a_url;
    }
    get_body() {
        return `ABOUT page ${this.srv_url}`;
    }
}
exports.BodyPage = BodyPage;
