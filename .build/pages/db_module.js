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
exports.db_AddToCart = exports.db_UserGet = exports.db_UserAdd = exports.db_ProductUpdate = exports.db_ProductGet = exports.db_ProductList = exports.db_ProductAdd = exports.db_CreateDataBase = void 0;
//import fs from "fs";
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
//sqlite3.verbose();
const dbpath = path_1.default.join(__dirname, "../goo01.db");
function db_CreateDataBase() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            try {
                const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                db.run(`CREATE TABLE IF NOT EXISTS product ( 
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name   VARCHAR(50) NOT NULL,
      articul   VARCHAR(20) NOT NULL,
      description  VARCHAR(50) NOT NULL,
      price real NOT NULL );
      `, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                db.run(`CREATE TABLE  IF NOT EXISTS users ( 
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        name   VARCHAR(50) NOT NULL UNIQUE,
        salt   string NOT NULL,
        hash string NOT NULL);
        `, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                db.run(`CREATE TABLE  IF NOT EXISTS carts ( 
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          id_user INTEGER NOT NULL,
          id_product INTEGER NOT NULL,
          sum INTEGER NOT NULL);
          `, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                db.close();
                resolve(1);
            }
            catch (err) {
                reject(err);
            }
        });
    });
}
exports.db_CreateDataBase = db_CreateDataBase;
function db_ProductAdd(product) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            db.run('INSERT INTO product(name, articul, description, price)  VALUES( ?,?,?,?)', [product.name,
                product.articul,
                product.description,
                product.price,
            ], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(1);
                }
            });
            db.close();
        });
    });
}
exports.db_ProductAdd = db_ProductAdd;
function db_ProductList() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            const query_str = 'select * from product order by name';
            db.all(query_str, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
            db.close();
        });
    });
}
exports.db_ProductList = db_ProductList;
function db_ProductGet(a_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            const query_str = 'select * from product where ID=?';
            db.get(query_str, [a_id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
            db.close();
        });
    });
}
exports.db_ProductGet = db_ProductGet;
function db_ProductUpdate(product) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            db.run('UPDATE product SET name=?, articul=?, description=?, price=? WHERE ID=?', [product.name,
                product.articul,
                product.description,
                product.price,
                product.ID,
            ], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(1);
                }
            });
            db.close();
        });
    });
}
exports.db_ProductUpdate = db_ProductUpdate;
function db_UserAdd(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            db.run('INSERT INTO users(name, salt, hash)  VALUES( ?,?,?)', [user.name, user.salt, user.hash], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ "lastID": this.lastID });
                }
            });
            db.close();
        });
    });
}
exports.db_UserAdd = db_UserAdd;
function db_UserGet(a_name) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            const query_str = 'select * from users where name=?';
            db.get(query_str, [a_name], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
            db.close();
        });
    });
}
exports.db_UserGet = db_UserGet;
function db_AddToCart(id, idp, sum) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            db.run('INSERT INTO carts(id_user, id_product, sum)  VALUES( ?,?,?)', [id,
                idp,
                sum
            ], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(1);
                }
            });
            db.close();
        });
    });
}
exports.db_AddToCart = db_AddToCart;
