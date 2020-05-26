import { iBase, whereSelect } from "./interfaces/interfaces";
import { DaoMySQL } from "./dao/dao_mysql";

abstract class Base implements iBase {
  constructor() {
    this._ID = 0;
  }
  find(parametro: whereSelect): Promise<iBase[]> {
    return new DaoMySQL().findDAO(this, parametro);
  }
  _ID: number;
  abstract nomeTabela(): String;
  select(id?: number): Promise<Array<iBase>> | Promise<iBase> {
    return new DaoMySQL().selectDAO(this, id);
  }
  insert(): Promise<iBase> {
    return new DaoMySQL().insertDAO(this);
  }
}

export { Base, DaoMySQL, iBase };
