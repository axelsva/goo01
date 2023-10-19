import * as mClass from './_clases.js';
import * as mDB from './db_module.js';

export async function get_body(param_obj: mClass.RouteParam) {

    let result_edit = `
        <h1>Product EDIT page</h1>
        <div class='debug'>${JSON.stringify(param_obj)}</div>
        <form action="/product_edit" method="POST">
            <p>
            ID : <input type="text" name="ID" value="[gl_product_id]" disabled><Br>
            Название:<input type="text" name="name" value="[gl_product_name]"><Br>
            Артикул:<input type="text" name="articul" value="[gl_product_articul]"><Br>
            Описание:<input type="text" name="description" value="[gl_product_description]"><Br>
            Цена:<input type="number" name="price" value="[gl_product_price]"><Br>
            </p><br>
            <button value=cmd_editproduct  type="submit" name="btn" formaction="/product_edit">Обновить товар</button>
            <button value=cmd_delproduct  type="submit" name="btn" formaction="/product_edit">Удалить товар</button>
            <button value=""  type="submit" name="btn" formaction="/product">К списку товаров</button>
        </form>
        `;


    let result = `
        <h1>Product ADD page</h1>
        <div class='debug'>${JSON.stringify(param_obj)}</div>
        <form action="/product_edit" method="POST">
            Название:<input type="text" name="name" value=""><Br>
            Артикул:<input type="text" name="articul" value=""><Br>
            Описание:<input type="text" name="description" value=""><Br>
            Цена:<input type="number" name="price" value=""><Br>
            <button value=cmd_addproduct  type="submit" name="btn" formaction="/product_edit">Добавить товар</button>
            <button value=cmd_addproduct  type="reset" name="btn" formaction="/product_edit">Очистить</button>
            <button value=""  type="submit" name="btn" formaction="/product">К списку товаровК</button>
        </form>
        `;

    if (param_obj && ('method' in param_obj) && ('arg' in param_obj)) {
        if (param_obj.method === 'POST' && param_obj.arg && ('btn' in param_obj.arg)) {

            const a_product = {} as mClass.Product;

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

                    if ('name' in param_obj.arg) {
                        a_product.name = param_obj.arg['name'] as string
                    }
                    if ('articul' in param_obj.arg) {
                        a_product.articul = param_obj.arg['articul'] as string
                    }
                    if ('description' in param_obj.arg) {
                        a_product.description = param_obj.arg['description'] as string
                    }
                    if ('price' in param_obj.arg) {
                        a_product.price = param_obj.arg['price'] as number
                    }

                    if (a_product.name.length < 3) {
                        result += 'Error: Length product name must be more than 2 characters';
                        return result;
                    }

                    try {
                        await mDB.db_ProductAdd(a_product)
                            .then(() => { result += 'Success add: ' + a_product.name; })
                            .catch((err) => { result += (err as Error).message; });
                    } catch (err) {
                        result += (err as Error).message;
                    }
                    break;
            }

        } else if (param_obj.method === 'GET' && param_obj.arg) {

            if ('id' in param_obj.arg && param_obj.arg.id !=='new') {
                result = result_edit;
            }

        }
    } 


    return result;
}
