"use strict";
//  GET ../cart    :get carts if User authorized
//  GET ../cart?btn=cmd_del&id=1    :del product from cart
//  GET ../cart?btn=cmd_order....     :get order
//      "arg":{"email":"test@ya.ru","tel":"","comment":"","adress":"Киров, улица Горького, 18","d_sum":"500","btn":"cmd_order"}
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_body = void 0;
const ejs_1 = __importDefault(require("ejs"));
const mClass = __importStar(require("./_clases"));
const mDB = __importStar(require("./db_module"));
function get_body(param_obj) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = '';
        const _data = {
            title: 'CART',
            cartitems_arr: [],
            order_fp: '',
            order_result: '',
            ssum: 0
        };
        let order_result = '';
        let order_fp = '';
        let cartitems_arr = [];
        let ssum = 0;
        if (param_obj && ('user' in param_obj)) {
            const user_id = mClass.getIDUserRegistr(param_obj.user) || param_obj.user.aid;
            if (!user_id) {
                throw new Error("Error: Please Login");
            }
            if ('arg' in param_obj && param_obj.arg && "btn" in param_obj.arg) {
                if (param_obj.arg.btn === 'cmd_order') {
                    try {
                        const order_param = mClass.validate_param_order(param_obj.arg);
                        order_param.user = mClass.getNameUserRegistr(param_obj.user);
                        yield mDB.db_CartList(user_id)
                            .then((_rows) => __awaiter(this, void 0, void 0, function* () {
                            const rows = _rows;
                            if (rows.length == 0) {
                                throw new Error("Error: Cart empty");
                            }
                            order_fp = yield mClass.send_order(order_param, rows);
                            yield mDB.db_CartToOrder(user_id);
                            throw new Error("db_CartToOrder");
                        }))
                            .catch((err) => { throw err; });
                    }
                    catch (err) {
                        //order_result = (err as Error).message;
                        throw err;
                    }
                }
                if (param_obj.arg.btn === 'cmd_del' && "id" in param_obj.arg) {
                    const a_id = param_obj.arg.id || 0;
                    yield mDB.db_CartDelProduct(a_id);
                }
            }
            yield mDB.db_CartList(user_id)
                .then((_rows) => {
                const rows = _rows;
                rows.forEach((_row) => {
                    const row = _row;
                    row.src = mClass.get_html_product_img(row.id_product);
                    row.RUR = mClass.app_cfg.get('RUR');
                    cartitems_arr.push(_row);
                    ssum += row.sum;
                });
            })
                .catch((err) => { throw err; });
        }
        else {
            throw new Error("Error: Please Login");
        }
        _data.order_fp = order_fp;
        _data.order_result = order_result;
        _data.cartitems_arr = cartitems_arr;
        _data.ssum = ssum;
        yield ejs_1.default.renderFile('./pages/cart.ejs', _data, {}, function (err, str) {
            if (err)
                throw err;
            result = str;
        });
        return result;
    });
}
exports.get_body = get_body;
