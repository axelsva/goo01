export function getBodyPages(a_url:string) {
    const a_title = "ООО Рога "+a_url;

    return   `<div><h1>About: ${a_title}</h1><div>`

}

export class BodyPage {
    srv_url
    
    constructor (a_url : string) {
        this.srv_url = a_url
    }

    get_body() {
        return `HOME page ${this.srv_url}`;
    }
}