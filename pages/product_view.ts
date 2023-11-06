import ejs from 'ejs';

import * as mClass from './_clases';
import * as mDB from './db_module';

export async function get_body(param_obj: mClass.RouteParam) {

    let result = '';

    const _data = {
        title: 'Product VIEW',
        products: {},
    }


    let product_db  = {} as mClass.Product;

    if (param_obj && ('method' in param_obj) && ('arg' in param_obj)) {
        if (param_obj.method === 'GET' && param_obj.arg && ('id' in param_obj.arg)) {

            await mDB.db_ProductGet(param_obj.arg.id as number)
                .then((_product_db) => {

                    product_db = _product_db as mClass.Product;
                    product_db.src = mClass.get_html_product_img(product_db.ID);
                    product_db.RUR = mClass.app_cfg.get('RUR');

                })
                .catch((err) => { throw err });
        }
    }


    _data.products = product_db;
    await ejs.renderFile('./pages/product_view.ejs', _data, {}, function (err, str) {
        if (err)
            throw err;

        result = str;
    });


    return result;
}
