import fs from "fs";
import sqlite3 from 'sqlite3';

sqlite3.verbose();

const filepath = "./goo01.db";


export function db_CreateDataBase() {
  //fs.openSync(filepath, "w");
  const db = new sqlite3.Database(filepath, sqlite3.OPEN_READWRITE)


  db.serialize(() => {

    db.run( `
    CREATE TABLE product ( 
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name   VARCHAR(50) NOT NULL,
      articul   VARCHAR(20) NOT NULL,
      description  VARCHAR(50) NOT NULL,
      price real NOT NULL );
      ` );
    });

    db.close();
}
  
