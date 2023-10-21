import * as mClass from '../pages/_clases.js';
import * as mDB from '../pages/db_module.js';


export async function get_body(param_obj: mClass.RouteParam) {

    let result = {};

    if (param_obj && ('method' in param_obj) && ('arg' in param_obj)) {
        if (param_obj.method === 'POST' && param_obj.arg) {

            try {
                const a_user = mClass.NewUserFromArray(param_obj.arg);

                await mDB.db_UserAdd(a_user)
                    .then((data) => { result = data as object })
                    .catch((err) => { result = (err as Error) });

            } catch (err) {
                result = (err as Error);
            }
        }
    }

    return result;
}
