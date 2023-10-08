import * as mDB from './db_module.js';
import { RouteParam } from './_clases.js';

export function get_body(param_obj: RouteParam) {

    let result = `
    <h1>INIT page</h1>
    <div class='debug'>${JSON.stringify(param_obj)}</div>

    <a href="/init?id=1">init id 1</a>

    <form  method="get">
        <input type="text" name="answer" value="a2">Операционная система<Br>
       
        <p>
            <button value=cmdDBCreate  type="submit" name="Btn" formaction="/init"> DB Create </button>
            <button value=4  type="submit" name="Btn" formaction="/init">knBtn2</button>
        </p>

    </form>
    `;



    if (param_obj && ('arg' in param_obj)) {
        if (param_obj.arg &&  ('Btn' in param_obj.arg )) {

            switch (param_obj.arg.Btn) {
                case 'cmdDBCreate': 
                    mDB.db_CreateDataBase();
                    result += 'DataBase created'
                    break;

              }

        }

    }

    return result;
}
