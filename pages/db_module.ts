//import fs from "fs";
import sqlite3 from 'sqlite3';
import path from 'path';

import * as mClass from './_clases.js';
//sqlite3.verbose();

const dbpath = path.join(__dirname, "../goo01.db");


export async function db_CreateDataBase() {

  return new Promise(function (resolve, reject) {

    try {

      const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
        (err) => {
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
      `,
        (err) => {
          if (err) {
            reject(err);
          }
        });

      db.run(`CREATE TABLE  IF NOT EXISTS users ( 
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        name   VARCHAR(50) NOT NULL UNIQUE,
        salt   string NOT NULL,
        hash string NOT NULL);
        `,
        (err) => {
          if (err) {
            reject(err);
          }
        });

      db.run(`CREATE TABLE  IF NOT EXISTS carts ( 
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          id_user INTEGER NOT NULL,
          id_product INTEGER NOT NULL,
          sum INTEGER NOT NULL);
          `,
        (err) => {
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

export async function db_ProductList(a_name: string, a_price: number) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    let query_str = ''

    if (a_name === '') {

      query_str = 'select * from product order by name';
      db.all(query_str, [],

        (err, rows) => {
          if (err) {

            reject(err);

          } else {

            resolve(rows);

          }
        });
    }

    else {

      console.log(a_name,a_price);

      query_str = 'select * from product where name = ? and price  >= ? ';

      db.all(query_str, [a_name, a_price],
        (err, rows) => {
          if (err) {

            reject(err);

          } else {

            resolve(rows);

          }
        });
    }

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

export async function db_UserAdd(user: mClass.TUser) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    db.run('INSERT INTO users(name, salt, hash)  VALUES( ?,?,?)',
      [user.name, user.salt, user.hash],

      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ "lastID": this.lastID });
        }
      });

    db.close();

  })
}


export async function db_UserGet(a_name: string) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    const query_str = 'select * from users where name=?';

    db.get(query_str, [a_name],
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

export async function db_AddToCart(id: number, idp: number, sum: number) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    db.run('INSERT INTO carts(id_user, id_product, sum)  VALUES( ?,?,?)',
      [id,
        idp,
        sum
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
