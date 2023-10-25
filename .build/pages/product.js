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
                            a_name = param_obj.arg.name;
                            a_price = param_obj.arg.price || 0;
                        }
                        break;
                }
            }
        }
        yield mDB.db_ProductList(a_name, a_price)
            .then((_rows) => {
            //result += JSON.stringify(rows);
            const rows = _rows;
            result += '<div class="productlist">';
            result += `<div class="productitemcaption">
                <div class="p_id">ID</div>
                <div class="p_name">NAME</div>
                <div class="p_articul">ARTIKUL</div>
                <div class="p_price">PRICE</div>
                </div>
                </hr>`;
            rows.forEach((_row) => {
                const row = _row;
                const img_src = mClass.get_html_product_img(row.ID);
                //if (('ID' in row) && ('name' in row) && ('articul' in row) && ('description' in row) && ('price' in row)) {
                result += '<div class="productitem">';
                result += `<div class="p_id"> ${mClass.get_html_a('' + row.ID, '/product_edit?id=' + row.ID)} </div>`;
                result += `<div class="p_img"><img src="${img_src}" alt ="${row.name}"></div>`;
                result += `<div class="p_name">${mClass.get_html_a(row.name, "/product_view?id=" + row.ID)}</div>`;
                result += `<div class="p_articul"> ${row.articul}</div>`;
                result += `<div class="p_price"> ${row.price}</div>`;
                result += `<input id="btn_addtocart" type="button" name="${row.ID}" onclick="Add_ToCart(${row.ID},${row.price})"   value="В Коризну">`;
                result += '</div>';
                result += `</hr>`;
                //}
            });
            result += '</div>';
        })
            .catch((err) => { result += err.message; });
        return result;
    });
}
exports.get_body = get_body;
