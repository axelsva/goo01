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
            title: 'Product VIEW',
            cmdEdit: 0,
            products: {},
            msg: ''
        };
        let product_db = {};
        if (param_obj && ('method' in param_obj) && ('arg' in param_obj)) {
            if (param_obj.method === 'POST' && param_obj.arg && ('btn' in param_obj.arg)) {
                switch (param_obj.arg.btn) {
                    case 'cmd_addproduct':
                        try {
                            product_db = mClass.NewProductFromArray(param_obj.arg);
                            const err_arr = mClass.ProductValidate(product_db);
                            if (err_arr.length > 0) {
                                throw new Error(err_arr.join('; '));
                            }
                            yield mDB.db_ProductAdd(product_db)
                                .then(() => { _data.msg = 'Success add: ' + product_db.name; })
                                .catch((err) => { throw err; });
                        }
                        catch (err) {
                            throw err;
                        }
                        break;
                    case 'cmd_updateproduct':
                        try {
                            product_db = mClass.NewProductFromArray(param_obj.arg);
                            const err_arr = mClass.ProductValidate(product_db);
                            if (err_arr.length > 0) {
                                throw new Error(err_arr.join('; '));
                            }
                            yield mDB.db_ProductUpdate(product_db)
                                .then(() => { _data.msg = 'Success update: ' + product_db.name; })
                                .catch((err) => { throw err; });
                        }
                        catch (err) {
                            throw err;
                        }
                        break;
                }
            }
            else if (param_obj.method === 'GET' && param_obj.arg) {
                if ('id' in param_obj.arg && param_obj.arg.id > 0) {
                    _data.cmdEdit = 1;
                    yield mDB.db_ProductGet(param_obj.arg.id)
                        .then((_product_db) => {
                        product_db = _product_db;
                    })
                        .catch((err) => { throw err; });
                }
            }
        }
        _data.products = product_db;
        yield ejs_1.default.renderFile('./pages/product_edit.ejs', _data, {}, function (err, str) {
            if (err)
                throw err;
            result = str;
        });
        return result;
    });
}
exports.get_body = get_body;
