import * as mClass from './_clases.js';
import * as mDB from './db_module.js';

export async function get_body(param_obj: mClass.RouteParam) {

    let result = `
        <h1>Cart page</h1>
    `;

    if (param_obj && ('user' in param_obj)) {

        const user_id = mClass.getIDUserRegistr(param_obj.user);
        if (!user_id) {
            throw new Error("Error: Please Login");
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
                    //result += `<div class="p_articul"> ${row.articul}</div>`;
                    result += `<div class="p_price"> ${row.sum} ${mClass.app_cfg.get('RUR')}</div>`;
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
                <div id="order">
                    <div id="div_form_order">
                    <form name="form_order" id="form_order" action="/product_edit" method="POST">
                        Please enter: <Br>
                        email:<input type="text" name="email" value=""><Br>
                        tel:<input type="text" name="tel" value=""><Br>
                        address:<input type="text" name="address" value=""><Br>
                        <br>
                        <button value=cmd_order type="submit" name="btn" formaction="/cart">Оформить заказ</button>
                    </form>
                    </div>

                    <div id="div_form_map">
                        <p class="header">Кликните по карте, чтобы узнать адрес</p>
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
