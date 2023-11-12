import * as mClass from '../pages/_clases';
import * as mDB from '../pages/db_module';


export async function get_body(param_obj: mClass.RouteParam) {

    let result = {};

    if (param_obj && ('method' in param_obj) && ('arg' in param_obj) && 'user' in param_obj) {

        // add product to cart
        if (param_obj.method === 'POST' && param_obj.arg) {

            try {

                let user_id = mClass.getIDUserRegistr(param_obj.user) || param_obj.user.aid;
                if (!user_id) {
                    throw new Error("Error: Please Login");
                }

                if (('idp' in param_obj.arg) && (param_obj.arg.idp) &&
                    ('sum' in param_obj.arg) && (param_obj.arg.sum) &&
                    ('name' in param_obj.arg) && (param_obj.arg.name)) {

                    const idp = param_obj.arg.idp as number;
                    const sum = param_obj.arg.sum as number;
                    const name = param_obj.arg.name as string;

                    await mDB.db_AddToCart(user_id, idp, sum, name)

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

        // get status cart - return: number items in cart
        if (param_obj.method === 'GET' && param_obj.arg) {

            try {

                const user_id = mClass.getIDUserRegistr(param_obj.user) || param_obj.user.aid;
                if (!user_id) {
                    throw new Error("Error: Please Login");
                }

                await mDB.db_CartList(user_id)
                    .then((_data) => {

                        const data = _data as [];

                        //console.log(data);

                        result = {
                            "result": "ok",
                            "data": data.length
                        }
                    })

                    .catch((err) => {
                        result = { "result": "error", "message": (err as Error).message }
                    });

            } catch (err) {
                result = { "result": "error", "message": (err as Error).message };
            }

        }
    }


    return result;
}
