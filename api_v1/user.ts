import * as mClass from '../pages/_clases.js';
import * as mDB from '../pages/db_module.js';


export async function get_body(param_obj: mClass.RouteParam) {

    let result = {};

    if (param_obj && ('method' in param_obj) && ('arg' in param_obj)) {
        if (param_obj.method === 'POST' && param_obj.arg) {

            if (('login' in param_obj.arg) && (param_obj.arg.login === '1')) {
                //login user

                try {
                    const a_user = mClass.NewUserFromArray(param_obj.arg);

                    await mDB.db_UserGet(a_user.name)
                        .then((data) => {
                            const db_user = data as mClass.TUser;

                            if (db_user) {
                                if (mClass.validPassword(a_user.psw, db_user.salt, db_user.hash)) {


                                    const cook = mClass.GetCookies_FromUser(db_user.ID, db_user.name)

                                    result = {
                                        "result": "ok", "data": {
                                            "name": db_user.name,
                                            "cook": cook,
                                        }
                                    }

                                } else {
                                    result = {
                                        "result": "error",
                                        "message": "password incorrect"
                                    }
                                }


                            } else {
                                result = {
                                    "result": "error",
                                    "message": "user not found "
                                }
                            }

                        })
                        .catch((err) => {
                            result = {
                                "result": "error",
                                "message": (err as Error).message
                            }
                        });

                } catch (err) {
                    result = {
                        "result": "error",
                        "message": (err as Error).message
                    };
                }

            } else {
                // register new user

                try {
                    const a_user = mClass.NewUserFromArray(param_obj.arg);

                    const _psw = mClass.setPassword(a_user.psw);
                    a_user.salt = _psw.salt;
                    a_user.hash = _psw.hash;

                    await mDB.db_UserAdd(a_user)
                        .then((data) => { result = { "result": "ok", "data": data } })
                        .catch((err) => { result = { "result": "error", "message": (err as Error).message } });

                } catch (err) {
                    result = { "result": "error", "message": (err as Error).message };
                }
            }
        }
    }

    return result;
}
