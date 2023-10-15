import * as mDB from './db_module.js';
import * as mClass from './_clases.js';


export async function get_body(param_obj: mClass.RouteParam) {

    let result = `
    <h1>INIT page</h1>
    <div class='debug'>${JSON.stringify(param_obj)}</div>

    <a href="/init?id=1">init id 1</a>

    <form  method="get">
        <input type="text" name="answer" value="a2">Операционная система<Br>
       
        <p>
            <button value=cmd_dbcreate  type="submit" name="btn" formaction="/init"> DB Create </button>
            <button value=4  type="submit" name="btn" formaction="/init">knBtn2</button>
        </p>

    </form>
    `;



    if (param_obj && ('arg' in param_obj)) {
        if (param_obj.arg && ('btn' in param_obj.arg)) {

            switch (param_obj.arg.btn) {
                case 'cmd_dbcreate':
                    try {
                        await mDB.db_CreateDataBase()
                        result += 'DataBase created' ;
                        
                        // await mDB.db_CreateDataBase()
                        //     .then(() => { result += 'DataBase created' })
                        //     .catch((err) => { result += err.message });
                    } catch (err) {
                        
                        result += (err as Error).message;
                        

                    }

                    break;

            }

        }

    }

    return result;
}
