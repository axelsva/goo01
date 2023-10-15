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
const mDB = __importStar(require("./db_module.js"));
function get_body(param_obj) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = `
    <h1>INIT page</h1>
    <div class='debug'>${JSON.stringify(param_obj)}</div>

    <a href="/init?id=1">init id 1</a>

    <form  method="get">
        <input type="text" name="answer" value="a2">Операционная система<Br>
       
        <p>
            <button value=cmd_dbcreate  type="submit" name="btn" formaction="/init"> DB Create </button>
            <button value=4  type="submit" name="btn" formaction="/init">knBtn2</button>
        </p>

    </form>
    `;
        if (param_obj && ('arg' in param_obj)) {
            if (param_obj.arg && ('btn' in param_obj.arg)) {
                switch (param_obj.arg.btn) {
                    case 'cmd_dbcreate':
                        try {
                            yield mDB.db_CreateDataBase();
                            result += 'DataBase created';
                            // await mDB.db_CreateDataBase()
                            //     .then(() => { result += 'DataBase created' })
                            //     .catch((err) => { result += err.message });
                        }
                        catch (err) {
                            result += err.message;
                        }
                        break;
                }
            }
        }
        return result;
    });
}
exports.get_body = get_body;
