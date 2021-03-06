import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import { IUser } from './types';
import oracledb from 'oracledb';

export default class Model {
  async Create(username: string, password: string): Promise<IUser | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ error: number }>(
      `BEGIN insertUser(p_username => :username, p_password => :password, p_error => :error); END;`,
      {
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
        password: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: password },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;
    return { username, password };
  }

  async FindOne(username: string): Promise<IUser | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ password: string; error: number }>(
      `BEGIN getPassword(p_username => :username, p_password => :password, p_error => :error); END;`,
      {
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
        password: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      {},
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    const password = result.outBinds.password;
    if (error !== 0 || password === undefined) return undefined;
    return { username, password };
  }
}
