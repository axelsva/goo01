"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyPage = void 0;
class BodyPage {
    constructor(a_url) {
        this.srv_url = a_url;
    }
    get_body() {
        return `
        <h1>INIT page: ${this.srv_url}</h1>

        <a href="/init?id=1">init id 1</a>

        <form  method="post">
            <input type="text" name="answer" value="a2">Операционная система<Br>
           
            <p>
                <button value=2  type="submit" name="Btn1" formaction="/init"> knBtn1 </button>
                <button value=4  type="submit" name="Btn1" formaction="/init">knBtn2</button>
            </p>
  
        </form>
        `;
    }
}
exports.BodyPage = BodyPage;
