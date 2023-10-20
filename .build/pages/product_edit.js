"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_body = void 0;
const mClass = __importStar(require("./_clases.js"));
const mDB = __importStar(require("./db_module.js"));
function get_body(param_obj) {
    return __awaiter(this, void 0, void 0, function* () {
        let result_edit = `
        <h1>Product EDIT page</h1>
        <div class='debug'>${JSON.stringify(param_obj)}</div>
        <form action="/product_edit" method="POST">
            ID:<input type="hidden" name="id" value="[gl_product_ID]" ><Br>
            Название:<input type="text" name="name" value="[gl_product_name]"><Br>
            Артикул:<input type="text" name="articul" value="[gl_product_articul]"><Br>
            Описание:<input type="text" name="description" value="[gl_product_description]"><Br>
            Цена:<input type="number" name="price" value="[gl_product_price]"><Br>
            <br>
            <button value=cmd_updateproduct  type="submit" name="btn" formaction="/product_edit">Обновить товар</button>
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
            <br>
            <button value=cmd_addproduct  type="submit" name="btn" formaction="/product_edit">Добавить товар</button>
            <button value=cmd_addproduct  type="reset" name="btn" formaction="/product_edit">Очистить</button>
            <button value=""  type="submit" name="btn" formaction="/product">К списку товаров</button>
        </form>
        `;
        if (param_obj && ('method' in param_obj) && ('arg' in param_obj)) {
            if (param_obj.method === 'POST' && param_obj.arg && ('btn' in param_obj.arg)) {
                let a_product = {};
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
                            yield mDB.db_ProductAdd(a_product)
                                .then(() => { result += 'Success add: ' + mClass.get_html_a_product(a_product); })
                                .catch((err) => { result += err.message; });
                        }
                        catch (err) {
                            result += err.message;
                        }
                        break;
                    case 'cmd_updateproduct':
                        try {
                            a_product = mClass.NewProductFromArray(param_obj.arg);
                            const err_arr = mClass.ProductValidate(a_product);
                            if (err_arr.length > 0) {
                                throw new Error(err_arr.join(';'));
                            }
                            yield mDB.db_ProductUpdate(a_product)
                                .then(() => { result += 'Success update: ' + mClass.get_html_a_product(a_product); })
                                .catch((err) => { result += err.message; });
                        }
                        catch (err) {
                            result += err.message;
                        }
                        break;
                }
            }
            else if (param_obj.method === 'GET' && param_obj.arg) {
                if ('id' in param_obj.arg && param_obj.arg.id !== 'new') {
                    result = result_edit;
                    yield mDB.db_ProductGet(param_obj.arg.id)
                        .then((_product_db) => {
                        const product_db = _product_db;
                        //result += 'Success get: ' + JSON.stringify(product_db);
                        result = result.replace("[gl_product_ID]", "" + product_db.ID);
                        result = result.replace("[gl_product_name]", product_db.name);
                        result = result.replace("[gl_product_articul]", product_db.articul);
                        result = result.replace("[gl_product_description]", product_db.description);
                        result = result.replace("[gl_product_price]", "" + product_db.price);
                    })
                        .catch((err) => { result += err.message; });
                }
            }
        }
        return result;
    });
}
exports.get_body = get_body;
