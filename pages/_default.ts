
const pageTemplate = `<head>
<link rel="stylesheet" type="text/css" href="/assets/css/style.css"></head>
<div class="glTop">[glTop]</div>
<div class="glMidle">
    <div class="glMidLeft ">[glMidLeft]</div>
    <div class="glMidRight">[glMidRight]</div>
</div>
<div class="glBottom">[glBottom]</div>`;


class defaultPage {

    url_obj: object;

    constructor(url_obj: object) {
        this.url_obj = url_obj;
    }

    get_glTop() {
        const a_tel = "8-800-88-98=87";
        const result = `
        "ооо рога и копыта", tel:${a_tel}
        <p><a href="/"><img src="/assets/img/imgTop.gif" 
         width="100" height="100" alt="To home"></a>
            ссылка домой</p>
            <p><a href="/about?id=8"><img src="/assets/img/imgAbout.png" 
            width="100" height="100" alt="To About"></a>
               ссылка about</p>`;
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


export { defaultPage };