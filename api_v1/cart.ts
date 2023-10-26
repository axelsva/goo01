import * as mClass from '../pages/_clases.js';
import * as mDB from '../pages/db_module.js';


export async function get_body(param_obj: mClass.RouteParam) {



    let result = {};

    if (param_obj && ('method' in param_obj) && ('arg' in param_obj) && 'user' in param_obj) {

        if (param_obj.method === 'POST' && param_obj.arg) {

            try {

                let id_user = 0;
                if (param_obj.user && 'id' in param_obj.user) {
                    id_user = param_obj.user.id as number || 0;
                }

                if (!id_user) {
                    throw new Error('Error: Need login');
                }


                if (('idp' in param_obj.arg) && (param_obj.arg.idp) &&
                    ('sum' in param_obj.arg) && (param_obj.arg.sum) &&
                    ('name' in param_obj.arg) && (param_obj.arg.name)) {

                    const idp = param_obj.arg.idp as number;
                    const sum = param_obj.arg.sum as number;
                    const name = param_obj.arg.name as string;

                    await mDB.db_AddToCart(id_user, idp, sum, name)

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
