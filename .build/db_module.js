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
exports.mDB = void 0;
const fs_1 = __importDefault(require("fs"));
const sqlite3_1 = __importDefault(require("sqlite3"));
sqlite3_1.default.verbose();
const filepath = "./fish.db";
class myDB {
    constructor() {
        if (fs_1.default.existsSync(filepath)) {
            this._db = new sqlite3_1.default.Database(filepath);
        }
        else {
            this._db = new sqlite3_1.default.Database(filepath, (err) => {
                if (err) {
                    console.error(err.message);
                }
                this.createTable();
            });
            console.log("Connection with SQLite has been established");
            //return db;
        }
    }
    createTable() {
        this._db.exec(`
         CREATE TABLE sharks
         (
           ID INTEGER PRIMARY KEY AUTOINCREMENT,
           name   VARCHAR(50) NOT NULL,
           color   VARCHAR(50) NOT NULL,
           weight INTEGER NOT NULL
         );
       `);
    }
    closeDb() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._db.close();
        });
    }
}
exports.mDB = new myDB();
