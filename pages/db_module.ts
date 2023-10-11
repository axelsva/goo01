//import fs from "fs";
import sqlite3 from 'sqlite3';
import path from 'path';

import * as mClass from './_clases.js';
import { rejects } from 'assert';

//sqlite3.verbose();

const dbpath = path.join(__dirname, "../goo01.db");


export async function db_CreateDataBase() {

  return new Promise(function(resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE);

    db.run(`
    CREATE TABLE  product ( 
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name   VARCHAR(50) NOT NULL,
      articul   VARCHAR(20) NOT NULL,
      description  VARCHAR(50) NOT NULL,
      price real NOT NULL );
      `,
      (err) => {
        if (err) {
          //reject(new Error("Error  db_CreateDataBase: "));
          throw new Error("Error  db_CreateDataBase: ");
        }

      });

    //  db.serialize( () => {
    //  })

    db.close();

    resolve(1);
  })

}


export async function db_ProductAdd(product: mClass.Product) {

  throw new Error("Error db_ProductAdd ");


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
