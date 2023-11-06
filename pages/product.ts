import ejs from 'ejs';

import * as mClass from './_clases';
import * as mDB from './db_module';


export async function get_body(param_obj: mClass.RouteParam) {


    let result = '';

    const _data = {
        title: 'Product',
        isAdmin: false,
        products: [],
    }


    if ('user' in param_obj) {
        _data.isAdmin = mClass.isRoleAdmin(param_obj.user);
    }



    let a_name = "";
    let a_price = 0;

    if (param_obj && ('arg' in param_obj)) {
        if (param_obj.arg && ('btn' in param_obj.arg)) {

            switch (param_obj.arg.btn) {
                case 'cmd_filtr':
                    if (("name" in param_obj.arg) && ("price" in param_obj.arg)) {
                        a_name = param_obj.arg.name as string;
                        a_price = param_obj.arg.price as number || 0;
                    }
                    break;
            }
        }
    }

    let products_arr: Array<mClass.Product> = [];

    await mDB.db_ProductList(a_name, a_price)
        .then((_rows) => {

            const rows = _rows as [];
            rows.forEach((_row) => {

                const row = _row as mClass.Product;
                row.src = mClass.get_html_product_img(row.ID);
                row.RUR = mClass.app_cfg.get('RUR');

                products_arr.push(row);

            })
        })
        .catch((err) => { throw err });

 
    _data.products = products_arr as [];
    await ejs.renderFile('./pages/product.ejs', _data, {}, function (err, str) {
        if (err)
            throw err;

        result = str;
    });


    return result;
}
