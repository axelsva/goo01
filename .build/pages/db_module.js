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
exports.db_CartListOrdered = exports.db_CartToOrder = exports.db_CartDelProduct = exports.db_CartList = exports.db_AddToCart = exports.db_UserGet = exports.db_UserAdd = exports.db_ProductUpdate = exports.db_ProductGet = exports.db_ProductList = exports.db_ProductAdd = exports.db_CreateDataBase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const dbpath = path_1.default.join(__dirname, "../goo01.db");
// select * from sqlite_master where type = 'trigger';
// DROP TRIGGER validate_email_before_insert_leads;
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
        name VARCHAR(50) NOT NULL,
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
          sum INTEGER NOT NULL,
          name VARCHAR(50) NOT NULL,
          ordered INTEGER DEFAULT 0 NOT NULL,
          mtime TIMESTAMP);
          `, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                db.run(`CREATE TRIGGER  IF NOT EXISTS carts_update AFTER  UPDATE ON carts
        BEGIN
          update carts SET mtime = datetime('now') WHERE id = new.id;
        END;
          `, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                db.run(`CREATE TRIGGER  IF NOT EXISTS carts_insert AFTER  INSERT ON carts
        BEGIN
          update carts SET mtime = datetime('now') WHERE id = new.id;
        END;
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
function db_ProductList(a_name, a_articul, a_price) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            let qp = [];
            let qm = [];
            if (a_name) {
                qm.push('name LIKE ?');
                qp.push('%' + a_name + '%');
            }
            if (a_articul) {
                qm.push('articul = ?');
                qp.push(a_articul);
            }
            if (a_price) {
                qm.push('price >= ?');
                qp.push(a_price);
            }
            let query_str = qm.join(' and ');
            if (query_str) {
                query_str = 'where ' + query_str;
            }
            query_str = 'select * from product ' + query_str + ' order by name ASC';
            console.log('query_str', query_str);
            db.all(query_str, qp, (err, rows) => {
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
function db_AddToCart(id, idp, sum, name) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            db.run('INSERT INTO carts(id_user, id_product, sum, name)  VALUES( ?,?,?, ?)', [id, idp, sum, name], (err) => {
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
function db_CartList(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            const query_str = 'select * from carts where id_user = ? AND ordered <> 1';
            db.all(query_str, [user_id], (err, rows) => {
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
exports.db_CartList = db_CartList;
function db_CartDelProduct(a_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            const query_str = 'DELETE FROM carts WHERE id = ?';
            db.run(query_str, [a_id], (err) => {
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
exports.db_CartDelProduct = db_CartDelProduct;
function db_CartToOrder(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            db.run('UPDATE carts SET ordered=? WHERE id_user=? AND ordered <> 1', [1, user_id], (err) => {
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
exports.db_CartToOrder = db_CartToOrder;
function db_CartListOrdered(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const db = new sqlite3_1.default.Database(dbpath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                }
            });
            const query_str = "select ID, id_product, sum, name, ordered, datetime( mtime, 'localtime') as mtime  from carts where id_user = ? AND ordered = 1 order by mtime ASC";
            db.all(query_str, [user_id], (err, rows) => {
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
exports.db_CartListOrdered = db_CartListOrdered;
