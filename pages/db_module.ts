//import fs from "fs";
import sqlite3 from 'sqlite3';
import path from 'path';

import * as mClass from './_clases.js';


//sqlite3.verbose();

const dbpath = path.join(__dirname, "../goo01.db");


export async function db_CreateDataBase() {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    db.run(`CREATE TABLE  product ( 
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name   VARCHAR(50) NOT NULL,
      articul   VARCHAR(20) NOT NULL,
      description  VARCHAR(50) NOT NULL,
      price real NOT NULL );
      `,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
      });

    db.close();
  })
}


export async function db_ProductAdd(product: mClass.Product) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    db.run('INSERT INTO product(name, articul, description, price)  VALUES( ?,?,?,?)',
      [product.name,
      product.articul,
      product.description,
      product.price,
      ],

      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
      });

    db.close();
  })
}

export async function db_ProductList() {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    const query_str = 'select * from product order by name';

    db.all(query_str, [],
      (err, rows) => {
        if (err) {

          reject(err);

        } else {

          resolve(rows);

        }
      });


    db.close();
  })
}




export async function db_ProductGet(a_id: number) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    const query_str = 'select * from product where ID=?';

    db.get(query_str, [a_id],
      (err, rows) => {
        if (err) {

          reject(err);

        } else {

          resolve(rows);
        }
      });


    db.close();
  })
}


export async function db_ProductUpdate(product: mClass.Product) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    db.run('UPDATE product SET name=?, articul=?, description=?, price=? WHERE ID=?',
      [product.name,
      product.articul,
      product.description,
      product.price,
      product.ID,
      ],

      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
      });

    db.close();
  })
}
