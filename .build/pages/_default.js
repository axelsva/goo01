"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPage = void 0;
const pageTemplate = `<head>
<link rel="stylesheet" type="text/css" href="/assets/css/style.css"></head>
<div class="glTop">[glTop]</div>
<div class="glMidle">
    <div class="glMidLeft ">[glMidLeft]</div>
    <div class="glMidRight">[glMidRight]</div>
</div>
<div class="glBottom">[glBottom]</div>`;
class defaultPage {
    constructor(url_obj) {
        this.url_obj = url_obj;
    }
    get_glTop() {
        const a_tel = "8-800-88-98=87";
        const result = `
        "ооо рога и копыта", tel:${a_tel}
        <a href="/"><img src="/assets/img/imgTop.gif" 
         width="100" height="100" alt="To home">home</a>
        <a href="/about"><img src="/assets/img/imgAbout.png" 
            width="100" height="100" alt="To About">about</a>
        <a href="/product?id=2">product</a>
        <a href="/init">init</a>
        `;
        return result;
    }
    get_glMidLeft() {
        return `Левая планка`;
    }
    get_glMidRight() {
        return `[glMidRight]`;
    }
    get_glBottom() {
        return `Это подвал:${JSON.stringify(this.url_obj)}`;
    }
    getPage() {
        let a_page = pageTemplate;
        a_page = a_page.replace("[glTop]", this.get_glTop());
        a_page = a_page.replace("[glMidLeft]", this.get_glMidLeft());
        a_page = a_page.replace("[glMidRight]", this.get_glMidRight());
        a_page = a_page.replace("[glBottom]", this.get_glBottom());
        return a_page;
    }
}
exports.defaultPage = defaultPage;
