import * as mClass from './_clases.js';
import * as mDB from './db_module.js';

export async function get_body(param_obj: mClass.RouteParam) {
    console.log('sdsdsd');


    let result = `
        <h1>Product EDIT page</h1>
        <div class='debug'>${JSON.stringify(param_obj)}</div>
        <form action="/product_edit" method="GET">
            Название:<input type="text" name="name" value=""><Br>
            Артикул:<input type="text" name="articul" value=""><Br>
            Описание:<input type="text" name="description" value=""><Br>
            Цена:<input type="text" name="price" value=""><Br>
            <button value=cmd_addproduct  type="submit" name="btn" formaction="/product_edit">Добавить товар</button>
            <button value=cmd_addproduct  type="reset" name="btn" formaction="/product_edit">Очистить</button>
        </form>
        `;

    if (param_obj && ('arg' in param_obj)) {
        if (param_obj.arg && ('btn' in param_obj.arg)) {

            const a_product = {} as mClass.Product;

            switch (param_obj.arg.btn) {
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

                    if (a_product.name.length>2) {
                        mDB.db_ProductAdd(a_product);
                    }

                    break;

            }

        }

    }

    return result;
}
