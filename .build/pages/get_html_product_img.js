"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_html_product_img = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function get_html_product_img(a_id) {
    const stub = "/upload/stub.jpg";
    let result = "" + stub;
    const a_num = a_id || 0;
    const fp = `/upload/${a_num}.jpg`;
    const filePath = path_1.default.join(__dirname, '..' + fp);
    let f_id = 0;
    try {
        f_id = fs_1.default.openSync(filePath, 'r');
        result = fp;
    }
    finally {
        fs_1.default.close(f_id);
    }
    ;
    return result;
}
exports.get_html_product_img = get_html_product_img;
