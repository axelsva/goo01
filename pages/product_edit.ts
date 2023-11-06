import ejs from 'ejs';

import * as mClass from './_clases';
import * as mDB from './db_module';


export async function get_body(param_obj: mClass.RouteParam) {

    let result = '';

    const _data = {
        title: 'Product VIEW',
        cmdEdit: 0,
        products: {},
        msg: ''
    }

    let product_db = {} as mClass.Product;


    if (param_obj && ('method' in param_obj) && ('arg' in param_obj)) {
        if (param_obj.method === 'POST' && param_obj.arg && ('btn' in param_obj.arg)) {

            switch (param_obj.arg.btn) {

                case 'cmd_addproduct':

                    try {
                        product_db = mClass.NewProductFromArray(param_obj.arg);
                        const err_arr = mClass.ProductValidate(product_db);

                        if (err_arr.length > 0) {
                            throw new Error(err_arr.join('; '));
                        }

                        await mDB.db_ProductAdd(product_db)
                            .then(() => { _data.msg = 'Success add: ' + product_db.name })
                            .catch((err) => { throw err });

                    } catch (err) {
                        throw err;
                    }
                    break;


                case 'cmd_updateproduct':

                    try {
                        product_db = mClass.NewProductFromArray(param_obj.arg);
                        const err_arr = mClass.ProductValidate(product_db);

                        if (err_arr.length > 0) {
                            throw new Error(err_arr.join('; '));
                        }

                        await mDB.db_ProductUpdate(product_db)
                            .then(() => {_data.msg =  'Success update: ' + product_db.name })
                            .catch((err) => { throw err });

                    } catch (err) {
                        throw err;
                    }
                    break;

            }

        } else if (param_obj.method === 'GET' && param_obj.arg) {

            if ('id' in param_obj.arg && (param_obj.arg.id as number) > 0) {

                _data.cmdEdit = 1;

                await mDB.db_ProductGet(param_obj.arg.id as number)
                    .then((_product_db) => {

                        product_db = _product_db as mClass.Product;

                    })
                    .catch((err) => { throw err });
            }
        }
    }


    _data.products = product_db;
    await ejs.renderFile('./pages/product_edit.ejs', _data, {}, function (err, str) {
        if (err)
            throw err;

        result = str;
    });


    return result;
}
