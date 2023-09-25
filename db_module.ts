import fs from "fs";
import sqlite3 from 'sqlite3';

sqlite3.verbose();

const filepath = "./fish.db";


 class myDB {

    _db 

    constructor() { 

          if (fs.existsSync(filepath)) {
            this._db = new sqlite3.Database(filepath);
          } else {
            this._db = new sqlite3.Database(filepath, (err: Error|null) => {
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

    async closeDb() {
        return this._db.close();
    }
}

export const mDB = new myDB();

