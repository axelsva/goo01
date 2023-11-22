
import ejs from 'ejs';

import * as mClass from './_clases';
import * as mDB from './db_module';


export async function get_body(param_obj: mClass.RouteParam) {

    let result = '';

    const _data = {
        title: 'ORDER History',
        cartitems_arr: [],
        ssum: 0
    }

    let cartitems_arr: Array<mClass.CartItem> = [];
    let ssum = 0;


    const user_id = mClass.getIDUserRegistr(param_obj.user) || 0;
    if (!user_id) {
        throw new Error("Error: Please Login");
    }


    await mDB.db_CartListOrdered(user_id)
        .then((_rows) => {

            const rows = _rows as [];

            rows.forEach((_row) => {

                const row = _row as mClass.CartItem;
                row.src = mClass.get_html_product_img(row.id_product);
                row.RUR = mClass.app_cfg.get('RUR');

                cartitems_arr.push(_row);
                ssum += row.sum;
            });
        })
        .catch((err) => { throw err });


    _data.cartitems_arr = cartitems_arr as [];
    _data.ssum = ssum;

    await ejs.renderFile('./pages/carthistory.ejs', _data, {}, function (err, str) {
        if (err)
            throw err;

        result = str;
    });


    return result;
}
