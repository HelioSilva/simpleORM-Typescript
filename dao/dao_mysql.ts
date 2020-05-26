import { iBase, iConn, iDao, whereSelect } from "../interfaces/interfaces";
import { Pool, createPool } from "mysql";

let __connection: Pool;

export function destroy(): Promise<Boolean> {
  return new Promise((resolve) => {
    if (__connection != null) {
      __connection.end();
    }
    resolve(true);
  });
}

export function connect(value: iConn, callback?: void): Promise<Boolean> {
  return new Promise(async (resolve, reject) => {
    let conn = await createPool({
      host: value.host || "localhost",
      user: value.user || "root",
      password: value.password || "",
      database: value.database,
    });

    __connection = conn;
    resolve(true);
  });
}

export class DaoMySQL implements iDao {
  findDAO(classe: iBase, parametro: whereSelect): Promise<iBase[]> {
    return new Promise(async (resolve, reject) => {
      let resp: iBase[];

      __connection.getConnection((err, conection) => {
        if (err) throw err; // not connected!

        conection.query(
          `SELECT * FROM ${classe.nomeTabela()} where ${parametro.campo} = ${
            parametro.valor
          }`,
          (error, results, fields) => {
            if (error) throw error;

            conection.release();
            // Handle error after the release.
            if (error) throw error;

            resolve(results);
          }
        );
      });
    });
  }

  selectDAO(classe: iBase, id?: number | undefined): Promise<iBase[]> {
    return new Promise(async (resolve, reject) => {
      let resp: iBase[];

      __connection.getConnection((err, conection) => {
        if (err) throw err; // not connected!

        if (id != null) {
          conection.query(
            `SELECT * FROM ${classe.nomeTabela()} where _ID = ${id}`,
            (error, results, fields) => {
              if (error) throw error;

              conection.release();
              // Handle error after the release.
              if (error) throw error;

              resolve(results[0]);
            }
          );
        } else {
          conection.query(
            `SELECT * FROM ${classe.nomeTabela()} ORDER BY _ID ASC `,
            (error, results, fields) => {
              if (error) throw error;

              conection.release();
              // Handle error after the release.
              if (error) throw error;

              resolve(results);
            }
          );
        }
      });
    });
  }
  insertDAO(classe: iBase): Promise<iBase> {
    return new Promise(async (resolve, reject) => {
      __connection.getConnection((err, conection) => {
        if (err) throw err; // not connected!

        conection.query(
          `INSERT INTO ${classe.nomeTabela()} SET ? `,
          classe,
          (error, results, fields) => {
            if (error) throw error;
            if (results.affectedRows == 1) {
              console.log("   => ", "inserido com sucesso");
              classe._ID = results.insertId;
            }

            conection.release();
            // Handle error after the release.
            if (error) throw error;

            resolve(classe);
          }
        );
      });
    });
  }

  selectGeneric(sql: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      __connection.getConnection((err, conection) => {
        if (err) throw err; // not connected!

        conection.query(sql, (error, results, fields) => {
          if (error) throw error;

          conection.release();
          // Handle error after the release.
          if (error) throw error;

          resolve(results[0]["count(1)"]);
        });
      });
    });
  }
}
