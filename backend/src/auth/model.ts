import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import { IUser, IUserInput } from './types';
import oracledb from 'oracledb';

export default class Model {
  async Create(user: IUserInput): Promise<IUser | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ user_id: number; error: number }>(
      `BEGIN insertUser(p_username => :p1, p_password => :p2, p_user_id => :user_id, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: user.username },
        p2: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: user.password },
        user_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );
    const error = result.outBinds?.error;
    if (error !== 0) return undefined;
    const user_id = result.outBinds?.user_id;
    if (user_id === undefined) return undefined;
    return { user_id, ...user };
  }

  async FindOne(username: string): Promise<IUser | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ user_id: number; password: string; error: number }>(
      `BEGIN getUser(p_username => :p1, p_user_id => :user_id, p_password => :password, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
        user_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        password: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      {},
    );

    const error = result.outBinds?.error;
    if (error !== 0) return undefined;

    const password = result.outBinds?.password;
    const user_id = result.outBinds?.user_id;
    if (user_id === undefined || password === undefined) return undefined;
    return { user_id, username, password };
  }
}
