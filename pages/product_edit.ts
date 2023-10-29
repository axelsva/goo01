import * as mClass from './_clases.js';
import * as mDB from './db_module.js';

export async function get_body(param_obj: mClass.RouteParam) {

    let result_edit = `
        <h1>Product EDIT page</h1>
        <div id="div_form_edit_product">
        <form name="form_edit_product" id="form_edit_product" action="/product_edit" method="POST">
            <label>ID: [gl_product_ID] </label> <Br> <input type="hidden" name="id" value="[gl_product_ID]" ><Br>
            <label>Название:</label> <Br> <input type="text" name="name" value="[gl_product_name]"><Br>
            <label>Артикул:</label> <Br> <input type="text" name="articul" value="[gl_product_articul]"><Br>
            <label>Описание:</label> <Br> <input type="text" name="description" value="[gl_product_description]"><Br>
            <label>Цена:</label> <Br> <input type="number" name="price" value="[gl_product_price]"><Br>
            <br>
            <button value=cmd_updateproduct  type="submit" name="btn" formaction="/product_edit">Обновить товар</button>
            <button value=""  type="submit" name="btn" formaction="/product">К списку товаров</button>
        </form>
        </div>
        `;


    let result = `
        <h1>Product ADD page</h1>
        <div>
        <form name="form_add_product" id="form_add_product"  action="/product_edit" method="POST">
            <label>Название:</label> <Br><input type="text" name="name" value=""><Br>
            <label>Артикул:</label> <Br><input type="text" name="articul" value=""><Br>
            <label>Описание:</label> <Br><input type="text" name="description" value=""><Br>
            <label>Цена:</label> <Br><input type="number" name="price" value=""><Br>
            <br>
            <button value=cmd_addproduct  type="submit" name="btn" formaction="/product_edit">Добавить товар</button>
            <button value=cmd_addproduct  type="reset" name="btn" formaction="/product_edit">Очистить</button>
            <button value=""  type="submit" name="btn" formaction="/product">К списку товаров</button>
        </form>
        </div>
        `;



    if (param_obj && ('method' in param_obj) && ('arg' in param_obj)) {
        if (param_obj.method === 'POST' && param_obj.arg && ('btn' in param_obj.arg)) {

            let a_product = {} as mClass.Product;

            switch (param_obj.arg.btn) {
                case 'cmd_error':
                    result += `
                    <p>
                    <a href="/product">Redirect</a>
                    </p>
                    <script>
                    setTimeout(function() {
                        window.location.href = "/about";
                        }, 3000); 
                        </script>
                    `;


                    //throw new Error("Error 777 ");
                    break;

                case 'cmd_addproduct':

                    try {
                        a_product = mClass.NewProductFromArray(param_obj.arg);
                        const err_arr = mClass.ProductValidate(a_product);

                        if (err_arr.length > 0) {
                            throw new Error(err_arr.join(';'));
                        }

                        await mDB.db_ProductAdd(a_product)
                            .then(() => { result += 'Success add: '+ a_product.name })
                            .catch((err) => { result += (err as Error).message; });

                    } catch (err) {
                        result += (err as Error).message;
                    }
                    break;


                case 'cmd_updateproduct':

                    try {
                        a_product = mClass.NewProductFromArray(param_obj.arg);
                        const err_arr = mClass.ProductValidate(a_product);

                        if (err_arr.length > 0) {
                            throw new Error(err_arr.join(';'));
                        }

                        await mDB.db_ProductUpdate(a_product)
                            .then(() => { result += 'Success update: ' + mClass.get_html_a_product(a_product) })
                            .catch((err) => { result += (err as Error).message; });

                    } catch (err) {
                        result += (err as Error).message;
                    }
                    break;

            }

        } else if (param_obj.method === 'GET' && param_obj.arg) {

            if ('id' in param_obj.arg && (param_obj.arg.id as number)>0) {
                result = result_edit;

                await mDB.db_ProductGet(param_obj.arg.id as number)
                    .then((_product_db) => {
                        const product_db = _product_db as mClass.Product;
                        //result += 'Success get: ' + JSON.stringify(product_db);

                        result = result.split("[gl_product_ID]").join( "" + product_db.ID);
                        result = result.replace("[gl_product_name]", product_db.name);
                        result = result.replace("[gl_product_articul]", product_db.articul);
                        result = result.replace("[gl_product_description]", product_db.description);
                        result = result.replace("[gl_product_price]", "" + product_db.price);

                    })
                    .catch((err) => { result += (err as Error).message; });

            }
        }
    }


    return result;
}
