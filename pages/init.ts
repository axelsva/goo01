

export class BodyPage {
    param_obj
    _mass
    
    constructor (param_obj : object) {
        this.param_obj = param_obj;
        this._mass = new Array(10000);
    }

    destroy  () {};

    get_body() {
        return `
        <h1>INIT page</h1>
        <div class='debug'>${JSON.stringify(this.param_obj)}</div>

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