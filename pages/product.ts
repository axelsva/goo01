

export class BodyPage {
    srv_url
    
    constructor (a_url : string) {
        this.srv_url = a_url
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