drop TABLE carts;
DROP TRIGGER carts_update;
select * from sqlite_master where type = 'trigger';

CREATE TRIGGER  IF NOT EXISTS carts_update AFTER  UPDATE ON carts
                  BEGIN
                    update carts SET mtime = datetime('now') WHERE id = new.id;
                  END;


CREATE TRIGGER  IF NOT EXISTS carts_insert AFTER  INSERT ON carts
                  BEGIN
                    update carts SET mtime = datetime('now') WHERE id = new.id;
                  END;