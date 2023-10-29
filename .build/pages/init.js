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
const mDB = __importStar(require("./db_module.js"));
const mClass = __importStar(require("./_clases.js"));
//import QRCode = require("qrcode");
const qrcode_1 = __importDefault(require("qrcode"));
function getQR_net() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            var os = require('os');
            let ifaces = os.networkInterfaces();
            Object.keys(ifaces).forEach(function (ifname) {
                let alias = 0;
                ifaces[ifname].forEach(function (iface) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (('family' in iface) && ('internal' in iface) && ('address' in iface)) {
                            if ('IPv4' !== iface.family || iface.internal !== false) {
                                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                                return;
                            }
                            if (alias >= 1) {
                                // this single interface has multiple ipv4 addresses
                                //console.log(ifname + ':' + alias, iface.address);
                            }
                            else {
                                // this interface has only one ipv4 adress
                                //console.log(ifname, iface.address);
                                // With promises
                                const _str = `https://${iface.address}:8000`;
                                yield qrcode_1.default.toDataURL(_str)
                                    .then((url) => {
                                    //console.log('qr:', url);
                                    const _res = `<br><b>${_str} </b> <br> <img src="${url}" /> <br>`;
                                    resolve(_res);
                                })
                                    .catch((err) => {
                                    console.error(err.message);
                                });
                            }
                            ++alias;
                        }
                    });
                });
            });
        });
    });
}
function get_body(param_obj) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = `
    <h1>INIT page</h1>
    </br>
    <form  method="get">
        <button value=cmd_dbcreate  type="submit" name="btn" formaction="/init"> DB Create </button>
    </form>
    </br>
    `;
        if (param_obj && ('user' in param_obj)) {
            const user_id = mClass.getIDUserRegistr(param_obj.user);
            if (!user_id) {
                throw new Error("Error: Please Login");
            }
            if (!mClass.isRoleAdmin(param_obj.user)) {
                throw new Error("Error: User role not Admin");
            }
        }
        if (param_obj && ('arg' in param_obj)) {
            if (param_obj.arg && ('btn' in param_obj.arg)) {
                switch (param_obj.arg.btn) {
                    case 'cmd_dbcreate':
                        try {
                            yield mDB.db_CreateDataBase()
                                .then(() => { result += 'DataBase created'; })
                                .catch((err) => { result += err.message; });
                        }
                        catch (err) {
                            result += err.message;
                        }
                        break;
                }
            }
        }
        const qr_data = yield getQR_net();
        result += qr_data;
        return result;
    });
}
exports.get_body = get_body;
