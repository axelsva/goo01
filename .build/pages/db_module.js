"use strict";
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
exports.db_ProductAdd = exports.db_CreateDataBase = void 0;
//import fs from "fs";
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
//sqlite3.verbose();
const dbpath = path_1.default.join(__dirname, "../goo01.db");
function db_CreateDataBase() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE);
            db.run(`
    CREATE TABLE  product ( 
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name   VARCHAR(50) NOT NULL,
      articul   VARCHAR(20) NOT NULL,
      description  VARCHAR(50) NOT NULL,
      price real NOT NULL );
      `, (err) => {
                if (err) {
                    //reject(new Error("Error  db_CreateDataBase: "));
                    throw new Error("Error  db_CreateDataBase: ");
                }
            });
            //  db.serialize( () => {
            //  })
            db.close();
            resolve(1);
        });
    });
}
exports.db_CreateDataBase = db_CreateDataBase;
function db_ProductAdd(product) {
    return __awaiter(this, void 0, void 0, function* () {
        throw new Error("Error db_ProductAdd ");
        const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE);
        db.run('INSERT INTO product(name, articul, description, price)  VALUES( ?,?,?,?)', [product.name,
            product.articul,
            product.description,
            product.price,
        ]);
        //  db.serialize( () => {
        //  })
        db.close();
    });
}
exports.db_ProductAdd = db_ProductAdd;
