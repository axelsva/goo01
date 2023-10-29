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
const mClass = __importStar(require("../pages/_clases.js"));
const mDB = __importStar(require("../pages/db_module.js"));
function get_body(param_obj) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = {};
        if (param_obj && ('method' in param_obj) && ('arg' in param_obj) && 'user' in param_obj) {
            // add product to cart
            if (param_obj.method === 'POST' && param_obj.arg) {
                try {
                    const user_id = mClass.getIDUserRegistr(param_obj.user);
                    if (!user_id) {
                        throw new Error("Error: Please Login");
                    }
                    if (('idp' in param_obj.arg) && (param_obj.arg.idp) &&
                        ('sum' in param_obj.arg) && (param_obj.arg.sum) &&
                        ('name' in param_obj.arg) && (param_obj.arg.name)) {
                        const idp = param_obj.arg.idp;
                        const sum = param_obj.arg.sum;
                        const name = param_obj.arg.name;
                        yield mDB.db_AddToCart(user_id, idp, sum, name)
                            .then((data) => {
                            result = {
                                "result": "ok",
                                "data": data
                            };
                        })
                            .catch((err) => {
                            result = { "result": "error", "message": err.message };
                        });
                    }
                }
                catch (err) {
                    result = { "result": "error", "message": err.message };
                }
            }
            // get status cart - return: number items in cart
            if (param_obj.method === 'GET' && param_obj.arg) {
                try {
                    const user_id = mClass.getIDUserRegistr(param_obj.user);
                    if (!user_id) {
                        throw new Error("Error: Please Login");
                    }
                    yield mDB.db_CartList(user_id)
                        .then((_data) => {
                        const data = _data;
                        //console.log(data);
                        result = {
                            "result": "ok",
                            "data": data.length
                        };
                    })
                        .catch((err) => {
                        result = { "result": "error", "message": err.message };
                    });
                }
                catch (err) {
                    result = { "result": "error", "message": err.message };
                }
            }
        }
        return result;
    });
}
exports.get_body = get_body;
