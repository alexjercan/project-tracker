import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import { IUser, IUserInput } from './types';

export default class Model {
  async Create(user: IUserInput): Promise<IUser | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ error: number }>(
      `BEGIN insertUser(p_username => :p1, p_password => :p2, p_error => :error); END;`,
      {
        p1: { dir: oracledbWrapper.BIND_IN, type: oracledbWrapper.STRING, val: user.username },
        p2: { dir: oracledbWrapper.BIND_IN, type: oracledbWrapper.STRING, val: user.password },
        error: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.NUMBER },
      },
      {},
    );

    const error = result.outBinds?.error;
    if (error !== 0) return undefined;
    return { ...user };
  }

  async FindOne(username: string): Promise<IUser | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ password: string; error: number }>(
      `BEGIN getUser(p_username => :p1, p_password => :password, p_error => :error); END;`,
      {
        p1: { dir: oracledbWrapper.BIND_IN, type: oracledbWrapper.STRING, val: username },
        password: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.STRING },
        error: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.NUMBER },
      },
      {},
    );

    const error = result.outBinds?.error;
    if (error !== 0) return undefined;

    const password = result.outBinds?.password;
    return { username, password };
  }
}
