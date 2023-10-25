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
                yield mDB.db_ProductGet(param_obj.arg.id)
                    .then((_product_db) => {
                    const product_db = _product_db;
                    const img_src = mClass.get_html_product_img(product_db.ID);
                    //result += 'Success get: ' + JSON.stringify(product_db);
                    result = result.split("[gl_product_name]").join("" + product_db.name);
                    result = result.replace("[gl_product_img]", img_src);
                    result = result.replace("[gl_product_articul]", product_db.articul);
                    result = result.replace("[gl_product_description]", product_db.description);
                    result = result.replace("[gl_product_price]", "" + product_db.price);
                })
                    .catch((err) => { result += err.message; });
            }
        }
        return result;
    });
}
exports.get_body = get_body;
