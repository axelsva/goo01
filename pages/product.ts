import ejs from 'ejs';

import * as mClass from './_clases';
import * as mDB from './db_module';


export async function get_body(param_obj: mClass.RouteParam) {

    let result = '';

    let min_max: { price_min: number, price_max: number } = { price_min: 0, price_max: 1000000 };

    const _min_max = await mDB.db_getProductPriceMinMax() as [];
    _min_max.forEach((_row) => {
        const row = (_row as { price_min: number, price_max: number });
        min_max.price_min = row.price_min;
        min_max.price_max = row.price_max;
    })


    const _data = {
        title: 'Product',
        isAdmin: false,
        products: [],
        filtrs: { a_name: '', a_articul: '', a_price_min: min_max.price_min, a_price_max: min_max.price_max }
    }


    if ('user' in param_obj) {
        _data.isAdmin = mClass.isRoleAdmin(param_obj.user);
    }



    let a_name = '';
    let a_articul = '';
    let a_price_min = min_max.price_min;
    let a_price_max = min_max.price_max;


    if (param_obj && ('arg' in param_obj)) {
        if (param_obj.arg && ('btn' in param_obj.arg)) {

            switch (param_obj.arg.btn) {
                case 'cmd_filtr':

                    a_name = ("name" in param_obj.arg) ? '' + param_obj.arg.name : '';
                    a_articul = ("articul" in param_obj.arg) ? '' + param_obj.arg.articul : '';
                    a_price_min = ("price_min" in param_obj.arg) ? parseInt((param_obj.arg.price_min as string), 10) || a_price_min : a_price_min;
                    a_price_max = ("price_max" in param_obj.arg) ? parseInt((param_obj.arg.price_max as string), 10) || a_price_max : a_price_max;

                    if (a_price_min > a_price_max) {
                        a_price_min = a_price_max;
                    }

                    _data.filtrs = { a_name, a_articul, a_price_min: a_price_min, a_price_max: a_price_max };

                    break;
            }
        }
    }

    let products_arr: Array<mClass.Product> = [];

    await mDB.db_ProductList(a_name, a_articul, a_price_min, a_price_max)
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
