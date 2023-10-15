import * as mClass from './_clases.js';

export async function get_body(param_obj: mClass.RouteParam) {

    let result = `
        <h1>Product page</h1>
        <div class='debug'>${JSON.stringify(param_obj)}</div>
        <div>${mClass.add_html_a('добавить товар', '/product_edit?id=new')}</div>

    `;


    

    if (param_obj && ('arg' in param_obj)) {
        if (param_obj.arg && ('btn' in param_obj.arg)) {

            switch (param_obj.arg.btn) {
                case 'cmd_dbcreate':


                    break;

            }

        }

    }

    return result;
}
