"use strict";
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
    const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE);
    db.run(`
  CREATE TABLE IF NOT EXISTS product ( 
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name   VARCHAR(50) NOT NULL,
    articul   VARCHAR(20) NOT NULL,
    description  VARCHAR(50) NOT NULL,
    price real NOT NULL );
    `);
    //  db.serialize( () => {
    //  })
    db.close();
}
exports.db_CreateDataBase = db_CreateDataBase;
function db_ProductAdd(product) {
    const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE);
    db.run('INSERT INTO product(name, articul, description, price)  VALUES( ?,?,?,?)', [product.name,
        product.articul,
        product.description,
        product.price,
    ]);
    //  db.serialize( () => {
    //  })
    db.close();
}
exports.db_ProductAdd = db_ProductAdd;
