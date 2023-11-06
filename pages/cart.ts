import * as mClass from './_clases';
import * as mDB from './db_module';

//  GET ../cart    :get carts if User authorized
//  GET ../cart?btn=cmd_del&id=1    :del product from cart
//  GET ../cart?btn=cmd_order....     :get order
//      "arg":{"email":"test@ya.ru","tel":"","comment":"","adress":"Киров, улица Горького, 18","d_sum":"500","btn":"cmd_order"}

export async function get_body(param_obj: mClass.RouteParam) {

    let result = `
        <h1>Cart page</h1>
    `;

    let order_result = '';

    if (param_obj && ('user' in param_obj)) {

        const user_id = mClass.getIDUserRegistr(param_obj.user);
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

                            const fp = await mClass.send_order(order_param, rows);
                            order_result = `
<script>
var link = document.createElement('a');
link.setAttribute('href','${fp}');
link.setAttribute('download','download');
onload=link.click();
</script>
                            `;
                            //await mDB.db_CartClear(user_id);
                        })
                        .catch(
                            (err) => { order_result = (err as Error).message; }
                        );

                } catch (err) {
                    order_result = (err as Error).message;
                }
            }



            if (param_obj.arg.btn === 'cmd_del' && "id" in param_obj.arg) {
                const a_id = param_obj.arg.id as number || 0;
                await mDB.db_CartDelProduct(a_id);
            }
        }

        await mDB.db_CartList(user_id)
            .then((_rows) => {
                //result += JSON.stringify(rows);

                const rows = _rows as [];
                result += '<div class="cartlist">';

                result += `
                <div class="cartitemcaption">
                    <div class="p_id">ID</div>
                    <div class="p_img">IMG</div>
                    <div class="p_name">NAME</div>
                    <div class="p_price">PRICE</div>
                </div>
                `;


                let ssum = 0;

                rows.forEach((_row) => {

                    const row = _row as mClass.CartItem;

                    const img_src = mClass.get_html_product_img(row.id_product);

                    result += '<div class="productitem">';
                    result += `<div class="p_id"> ${row.id_product} </div>`;
                    result += `<div class="p_img"><img src="${img_src}" alt ="${row.name}"></div>`;
                    result += `<div class="p_name">${mClass.get_html_a(row.name, "/product_view?id=" + row.id_product)}</div>`;
                    result += `<div class="p_price"> ${row.sum} ${mClass.app_cfg.get('RUR')}</div>`;
                    result += `<div class="RoundRectDark_a"> ${mClass.get_html_a("DEL", "/cart?btn=cmd_del&id=" + row.ID)}</div>`;
                    result += '</div>';

                    ssum += row.sum;
                });

              
                result += `
                <div class="cartitemcaption">
                    <div class="p_id"></div>
                    <div class="p_img"></div>
                    <div class="p_name">TOTAL</div>
                    <div class="p_price">${ssum} ${mClass.app_cfg.get('RUR')}</div>
                </div>
                `;

                result += '</div>'  //'<div class="cartlist">'

                result += `
                <div id="order_result">${order_result}</div>
                `;

                result += `
                <div id="order">
                    <br>
                    <div id="div_form_order">
                    <form name="form_order" id="form_order" action="/cart" method="POST">
                        <label>Please enter data for order: </label><Br><BR>
                        <label>Email:</label><Br><input type="email" name="email" value="test@ya.ru"><Br>
                        <label>Tel:</label><Br><input type="tel" name="tel" value="7777777"><Br>
                        <label>Comment:</label><Br><input type="text" name="comment" value=""><Br>
                        <input id='inputaddress'type="text" name="address" value="" hidden>
                        <input id='d_sum' type="number" name="d_sum" value="" hidden>
                        <label>Address: </label><Br><div id="div_inputaddress">Выберите адрес доставки на карте</div>
                        <label>Delivery Sum:</label><Br> <div id="div_d_sum"> 0</div>
                        <label>* tariff: 10 руб/км, min: 50 руб </label><Br>
                        <br>
                        <button value=cmd_order type="submit" name="btn" formaction="/cart">Оформить заказ</button>
                    </form>
                    </div>

                    <div id="div_form_map">
                        <p class="header">Кликните по карте, чтобы задать адрес доставки</p>
                        <div id="map"></div>
                    </div>

                </div>
                `;


            })
            .catch((err) => { result += (err as Error).message; });


    } else {
        throw new Error("Error: Please Login");
    }


    return result;
}
