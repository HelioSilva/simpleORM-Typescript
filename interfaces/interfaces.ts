export interface iBase {
  _ID: number;
  nomeTabela(): String;
  select(id?: number): void; //Promise<Array<iBase>> | Promise<iBase>;
  insert(): Promise<iBase>;
  find(parametro: whereSelect): Promise<iBase[]>;
}

export interface iDao {
  selectDAO(classe: iBase, id?: number): Promise<Array<iBase>>;
  insertDAO(classe: iBase): Promise<iBase>;
  findDAO(classe: iBase, parametro: whereSelect): Promise<iBase[]>;
}

export interface whereSelect {
  campo: string;
  valor: string | number;
}

export interface iConn {
  host?: string;
  user?: string;
  password?: string;
  database: string;
}
