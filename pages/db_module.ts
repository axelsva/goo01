//import fs from "fs";
import sqlite3 from 'sqlite3';
import path from 'path';

import * as mClass from './_clases.js';

//sqlite3.verbose();

const dbpath = path.join(__dirname, "../goo01.db");


export function db_CreateDataBase() {

  const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE);

  db.run(`
  CREATE TABLE IF NOT EXISTS product ( 
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name   VARCHAR(50) NOT NULL,
    articul   VARCHAR(20) NOT NULL,
    description  VARCHAR(50) NOT NULL,
    price real NOT NULL );
    ` );

  //  db.serialize( () => {
  //  })

  db.close();
}


export function db_ProductAdd(product: mClass.Product) {

  const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE);

  db.run('INSERT INTO product(name, articul, description, price)  VALUES( ?,?,?,?)',
    [product.name,
    product.articul,
    product.description,
    product.price,
    ]);

  //  db.serialize( () => {
  //  })

  db.close();
}
