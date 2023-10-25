import * as mClass from './_clases.js';
import * as mDB from './db_module.js';

export async function get_body(param_obj: mClass.RouteParam) {

    let result = `
        <h1>Product view page</h1>
        <div>
            <h2>[gl_product_name]</h2>
            <div><img src="[gl_product_img]" alt ="[gl_product_name]"></div>
            <div>Название: [gl_product_name]</div>
            <div>Артикул: [gl_product_articul]</div>
            <div>Описание: [gl_product_description]</div>
            <div>Цена: [gl_product_price]</div>
        </div>
        `;


    if (param_obj && ('method' in param_obj) && ('arg' in param_obj)) {
        if (param_obj.method === 'GET' && param_obj.arg && ('id' in param_obj.arg)) {


            await mDB.db_ProductGet(param_obj.arg.id as number)
                .then((_product_db) => {
                    

                    const product_db = _product_db as mClass.Product;

                    const img_src = mClass.get_html_product_img(product_db.ID);
                    
                    //result += 'Success get: ' + JSON.stringify(product_db);

                    result = result.split("[gl_product_name]").join("" + product_db.name);
                    result = result.replace("[gl_product_img]", img_src);
                    result = result.replace("[gl_product_articul]", product_db.articul);
                    result = result.replace("[gl_product_description]", product_db.description);
                    result = result.replace("[gl_product_price]", "" + product_db.price);

                })
                .catch((err) => { result += (err as Error).message; });



        }

    }

    return result;
}
