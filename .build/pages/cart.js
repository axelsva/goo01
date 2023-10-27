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
        <h1>Cart page</h1>
    `;
        if (param_obj && ('user' in param_obj)) {
            const user_id = mClass.getIDUserRegistr(param_obj.user);
            if (!user_id) {
                throw new Error("Error: Please Login");
            }
            yield mDB.db_CartList(user_id)
                .then((_rows) => {
                //result += JSON.stringify(rows);
                const rows = _rows;
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
                    const row = _row;
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
                result += '</div>'; //'<div class="cartlist">'
                result += `
                <div id="order">
                    <div id="div_form_order">
                    <form name="form_order" id="form_order" action="/product_edit" method="POST">
                        Please enter: <Br>
                        email:<input type="text" name="email" value=""><Br>
                        tel:<input type="text" name="tel" value=""><Br>
                        address:<input id='inputaddress'type="text" name="adress" value=""><Br>
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
                .catch((err) => { result += err.message; });
        }
        else {
            throw new Error("Error: Please Login");
        }
        return result;
    });
}
exports.get_body = get_body;
