import * as mClass from './_clases.js';
import * as mDB from './db_module.js';

export async function get_body(param_obj: mClass.RouteParam) {

    let result = `
        <h1>Product page</h1>
        <div class='debug'>${JSON.stringify(param_obj)}</div>
        <div>${mClass.get_html_a('добавить товар', '/product_edit?id=new')}</div>
    `;

    if (param_obj && ('arg' in param_obj)) {
        if (param_obj.arg && ('btn' in param_obj.arg)) {

            switch (param_obj.arg.btn) {
                case 'cmd_dbcreate':

                    break;
            }
        }
    }

    await mDB.db_ProductList()
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

                const row = _row  as mClass.Product;

                //if (('ID' in row) && ('name' in row) && ('articul' in row) && ('description' in row) && ('price' in row)) {
                    result += '<div class="productitem">';
                    result += `<div class="p_id"> ${mClass.get_html_a(''+row.ID, '/product_edit?id='+row.ID)} </div>`;
                    result += `<div class="p_name"> ${row.name}</div>`;
                    result += `<div class="p_articul"> ${row.articul}</div>`;
                    result += `<div class="p_price"> ${row.price}</div>`;
                    result += '</div>';
                    result += `</hr>`;
                    //}

            });

            result += '</div>'
            result += `
                <form  method="get">

                <button value=cmd_updateproduct  type="submit" name="btn" formaction="/product_edit?id=new">Добавить товар</button>
                </form>
                `;

        })
        .catch((err) => { result += (err as Error).message; });

    return result;
}
