"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db_CreateDataBase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
sqlite3_1.default.verbose();
const filepath = "./goo01.db";
function db_CreateDataBase() {
    //fs.openSync(filepath, "w");
    const db = new sqlite3_1.default.Database(filepath, sqlite3_1.default.OPEN_READWRITE);
    db.serialize(() => {
        db.run(`
    CREATE TABLE product ( 
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name   VARCHAR(50) NOT NULL,
      articul   VARCHAR(20) NOT NULL,
      description  VARCHAR(50) NOT NULL,
      price real NOT NULL );
      `);
    });
    db.close();
}
exports.db_CreateDataBase = db_CreateDataBase;
