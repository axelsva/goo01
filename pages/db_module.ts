import sqlite3 from 'sqlite3';
import path from 'path';

import * as mClass from './_clases';

// tsc-build
//const dbpath = path.join(__dirname, "../goo01.db");

// ts-node
const dbpath = path.join(__dirname, "../.build/goo01.db");


// select * from sqlite_master where type = 'trigger';
// DROP TRIGGER validate_email_before_insert_leads;

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
        name VARCHAR(50) NOT NULL,
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
          sum INTEGER NOT NULL,
          name VARCHAR(50) NOT NULL,
          ordered INTEGER DEFAULT 0 NOT NULL,
          mtime TIMESTAMP);
          `,
        (err) => {
          if (err) {
            reject(err);
          }
        });

      db.run(`CREATE TRIGGER  IF NOT EXISTS carts_update AFTER  UPDATE ON carts
        BEGIN
          update carts SET mtime = datetime('now') WHERE id = new.id;
        END;
          `,
        (err) => {
          if (err) {
            reject(err);
          }
        });

      db.run(`CREATE TRIGGER  IF NOT EXISTS carts_insert AFTER  INSERT ON carts
        BEGIN
          update carts SET mtime = datetime('now') WHERE id = new.id;
        END;
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


export async function db_ProductList(a_name: string, a_articul: string, a_price_min: number, a_price_max: number) {

  return new Promise(function (resolve, reject) {

    //console.log("dbpath", dbpath);

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
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

      qm.push('price >= ?');
      qp.push(a_price_min);

      qm.push('price <= ?');
      qp.push(a_price_max);


    let query_str = qm.join(' and ');
    if (query_str) { query_str = 'where ' + query_str }

    query_str = 'select * from product ' + query_str + ' order by name ASC';

    console.log('query_str', query_str, qp);

    db.all(query_str, qp,

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

export async function db_UserAdd(user: mClass.User) {

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

export async function db_AddToCart(id: number, idp: number, sum: number, name: string) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    db.run('INSERT INTO carts(id_user, id_product, sum, name)  VALUES( ?,?,?, ?)',
      [id, idp, sum, name],

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



export async function db_CartList(user_id: number) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });


    const query_str = 'select * from carts where id_user = ? AND ordered <> 1';

    db.all(query_str, [user_id],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });

    db.close();
  });

}



export async function db_CartDelProduct(a_id: number) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });


    const query_str = 'DELETE FROM carts WHERE id = ?';

    db.run(query_str, [a_id],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
      });

    db.close();
  });

}

export async function db_CartToOrder(user_id: number, user_id0: number) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    db.run('UPDATE carts SET ordered=?, id_user=? WHERE id_user=? AND ordered <> 1',
      [1, user_id0, user_id],

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


export async function db_CartListOrdered(user_id: number) {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });


    const query_str = "select ID, id_product, sum, name, ordered, datetime( mtime, 'localtime') as mtime  from carts where id_user = ? AND ordered = 1 order by mtime ASC";

    db.all(query_str, [user_id],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });

    db.close();
  });

}


export async function db_ClearCarts() {

  return new Promise(function (resolve, reject) {

    const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        }
      });

    const query_str = "delete from carts ";

    db.all(query_str, [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });

    db.close();
  });

}



