
export class BodyPage {
    srv_url
    
    constructor (a_url : string) {
        this.srv_url = a_url
    }

    get_body() {
        return `<h1>Product page: ${this.srv_url}</h1>`;
    }
}