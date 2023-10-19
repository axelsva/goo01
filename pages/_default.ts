

export function getPage(url_obj: object) {

    const pageTemplate = `
    <head>
        <link rel="stylesheet" type="text/css" href="/assets/css/style.css">
    </head>
    <body>
        <div class="glMain">
            <div class="glTop">[glTop]</div>
            <div class="glMidle">
                <div class="glMidLeft ">[glMidLeft]</div>
                <div class="glMidRight">[glMidRight]</div>
            </div>
            <div class="glBottom">[glBottom]</div>
        </div>
    </body>
        `;


    function get_glTop() {
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

    function get_glMidLeft() {
        return `Левая планка`;
    }

    function get_glMidRight() {
        return `[glMidRight]`;
    }

    function get_glBottom() {
        return `Это подвал:${JSON.stringify(url_obj)}`;
    }



    let a_page = pageTemplate;
    a_page = a_page.replace("[glTop]", get_glTop());
    a_page = a_page.replace("[glMidLeft]", get_glMidLeft());
    a_page = a_page.replace("[glMidRight]", get_glMidRight());
    a_page = a_page.replace("[glBottom]", get_glBottom());

    return a_page;
}
