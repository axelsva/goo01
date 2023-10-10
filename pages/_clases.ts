export interface RouteParam {
    method: string,
    url: string,
    pathname: string,
    arg: object,
}

export interface Product {
    name: string,
    articul: string,
    description: string,
    price: number
}

export function add_html_a(text: string, href: string) {
    return `<a href="${href}">${text}</a>`;    
}




