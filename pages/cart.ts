//  GET ../cart    :get carts if User authorized
//  GET ../cart?btn=cmd_del&id=1    :del product from cart
//  GET ../cart?btn=cmd_order....     :get order
//      "arg":{"email":"test@ya.ru","tel":"","comment":"","adress":"Киров, улица Горького, 18","d_sum":"500","btn":"cmd_order"}

import ejs from 'ejs';

import * as mClass from './_clases';
import * as mDB from './db_module';



export async function get_body(param_obj: mClass.RouteParam) {

    let result = '';

    const _data = {
        title: 'CART',
        cartitems_arr: [],
        order_fp: '',
        order_result: '',
        ssum: 0
    }

    let order_result = '';
    let order_fp = '';
    let cartitems_arr: Array<mClass.CartItem> = [];
    let ssum = 0;


    if (param_obj && ('user' in param_obj)) {

        const user_id = mClass.getIDUserRegistr(param_obj.user) || param_obj.user.aid;
        if (!user_id) {
            throw new Error("Error: Please Login");
        }

        if ('arg' in param_obj && param_obj.arg && "btn" in param_obj.arg) {

            if (param_obj.arg.btn === 'cmd_order') {

                try {

                    const order_param = mClass.validate_param_order(param_obj.arg);
                    order_param.user = mClass.getNameUserRegistr(param_obj.user);

                    await mDB.db_CartList(user_id)
                        .then(async (_rows) => {

                            const rows = _rows as [];
                            if (rows.length == 0 ) {
                                throw new Error("Error: Cart empty");
                            }

                            order_fp = await mClass.send_order(order_param, rows);
                            await mDB.db_CartToOrder(user_id);

                            throw new Error("db_CartToOrder");
                            
                        })
                        .catch( (err) => { throw err } );

                } catch (err) {
                    //order_result = (err as Error).message;
                    throw err 
                }
            }


            if (param_obj.arg.btn === 'cmd_del' && "id" in param_obj.arg) {
                const a_id = param_obj.arg.id as number || 0;
                await mDB.db_CartDelProduct(a_id);
            }

        }

        await mDB.db_CartList(user_id)
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

    } else {
        throw new Error("Error: Please Login");
    }


    _data.order_fp = order_fp;
    _data.order_result = order_result;
    _data.cartitems_arr = cartitems_arr as [];
    _data.ssum = ssum;

    await ejs.renderFile('./pages/cart.ejs', _data, {}, function (err, str) {
        if (err)
            throw err;

        result = str;
    });


    return result;
}
