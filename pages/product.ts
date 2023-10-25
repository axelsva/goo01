import * as mClass from './_clases.js';
import * as mDB from './db_module.js';

export async function get_body(param_obj: mClass.RouteParam) {

    let result = `
        <h1>Product page</h1>
        <div class="RoundRectDark">${mClass.get_html_a('добавить товар', '/product_edit?id=new')}</div>
        <div class="RoundRectDark">
            <form name="form_product_filtr" id="form_product_filtr" action="/product" method="GET">
                Фильтр:<input type="text" name="name" value="">
                Цена: <input type="number" name="price" value="">
                <button value=cmd_filtr  type="submit" name="btn" formaction="/product">Отфильтровать</button>
            </form>
        </div>
    `;

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

    await mDB.db_ProductList(a_name, a_price)
        .then((_rows) => {
        //result += JSON.stringify(rows);

        const rows = _rows as [];
        result += '<div class="productlist">';

        result += `<div class="productitemcaption">
                <div class="p_id">ID</div>
                <div class="p_name">NAME</div>
                <div class="p_articul">ARTIKUL</div>
                <div class="p_price">PRICE</div>
                </div>
                </hr>`;


        rows.forEach((_row) => {

            const row = _row as mClass.Product;

            const img_src = mClass.get_html_product_img(row.ID);

            //if (('ID' in row) && ('name' in row) && ('articul' in row) && ('description' in row) && ('price' in row)) {
            result += '<div class="productitem">';
            result += `<div class="p_id"> ${mClass.get_html_a('' + row.ID, '/product_edit?id=' + row.ID)} </div>`;
            result += `<div class="p_img"><img src="${img_src}" alt ="${row.name}"></div>`;
            result += `<div class="p_name">${mClass.get_html_a(row.name,"/product_view?id=" + row.ID)}</div>`;
            result += `<div class="p_articul"> ${row.articul}</div>`;
            result += `<div class="p_price"> ${row.price}</div>`;
            result += `<input id="btn_addtocart" type="button" name="${row.ID}" onclick="Add_ToCart(${row.ID},${row.price})"   value="В Коризну">`;
            result += '</div>';
            result += `</hr>`;
            //}

        });

        result += '</div>'

    })
        .catch((err) => { result += (err as Error).message; });

    return result;
}
