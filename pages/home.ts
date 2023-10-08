
export function get_body(param_obj: object) {
    return `
        <h1>HOME page</h1>
        <div class='debug'>${JSON.stringify(param_obj)}</div>
        `;
}
