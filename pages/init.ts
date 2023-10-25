import * as mDB from './db_module.js';
import * as mClass from './_clases.js';


export async function get_body(param_obj: mClass.RouteParam) {

    let result = `
    <h1>INIT page</h1>
    </br>
    <form  method="get">
        <button value=cmd_dbcreate  type="submit" name="btn" formaction="/init"> DB Create </button>
    </form>
    </br>
    `;



    if (param_obj && ('arg' in param_obj)) {
        if (param_obj.arg && ('btn' in param_obj.arg)) {

            switch (param_obj.arg.btn) {
                case 'cmd_dbcreate':
                    try {
                        
                        await mDB.db_CreateDataBase()
                            .then(() => { result += 'DataBase created' })
                            .catch((err) => { result += err.message });

                    } catch (err) {
                        
                        result += (err as Error).message;
                        
                    }

                    break;

            }

        }

    }

    return result;
}
