"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db_CreateDataBase = exports.db_CreateConnection = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
sqlite3_1.default.verbose();
const filepath = "./_db/goo01.db";
function db_CreateConnection() {
    const db = new sqlite3_1.default.Database(filepath, (error) => {
        if (error) {
            return console.error(error.message);
        }
    });
    console.log("Connection with SQLite has been established");
    return db;
}
exports.db_CreateConnection = db_CreateConnection;
function db_CreateDataBase(db) {
    db.serialize(() => {
        db.run(`
    CREATE TABLE product ( 
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name   VARCHAR(50) NOT NULL,
      articul   VARCHAR(20) NOT NULL,
      description  VARCHAR(50) NOT NULL,
      price integer NOT NULL );
      `);
    });
}
exports.db_CreateDataBase = db_CreateDataBase;
