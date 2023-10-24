import * as mClass from '../pages/_clases.js';
import * as mDB from '../pages/db_module.js';


export async function get_body(param_obj: mClass.RouteParam) {



    let result = {};

    if (param_obj && ('method' in param_obj) && ('arg' in param_obj)) {

        if (param_obj.method === 'POST' && param_obj.arg) {

            try {

                if (('id' in param_obj.arg) && (param_obj.arg.id) &&
                    ('idp' in param_obj.arg) && (param_obj.arg.idp) &&
                    ('sum' in param_obj.arg) && (param_obj.arg.sum)) {

                    const id = param_obj.arg.id as number;
                    const idp = param_obj.arg.idp as number;
                    const sum = param_obj.arg.sum as number;

                    await mDB.db_AddToCart(id, idp, sum)

                        .then((data) => {

                            result = {
                                "result": "ok",
                                "data": data
                            }

                        })

                        .catch((err) => {
                            result = { "result": "error", "message": (err as Error).message }
                        });
                }


            } catch (err) {
                result = { "result": "error", "message": (err as Error).message };
            }


        }
    }

    return result;
}
