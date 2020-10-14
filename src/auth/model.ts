import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import { IUser, IUserInput } from './types';

export default class Model {
  async Create(user: IUserInput): Promise<IUser | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ user_id: string }>(
      `BEGIN insertUser(p_username => :username, p_password => :p2, p_user_id => :user_id); END;`,
      {
        p1: { dir: oracledbWrapper.BIND_IN, type: oracledbWrapper.STRING, val: user.username },
        p2: { dir: oracledbWrapper.BIND_IN, type: oracledbWrapper.STRING, val: user.password },
        user_id: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.STRING },
      },
      {},
    );

    const id = result.outBinds?.user_id;
    if (id === undefined) return undefined;
    return { _id: id, ...user };
  }

  async FindOne(username: string): Promise<IUser | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ password: string; user_id: string }>(
      `BEGIN getPassword(p_username => :p1, p_password => :password, p_user_id => :user_id); END;`,
      {
        p1: { dir: oracledbWrapper.BIND_IN, type: oracledbWrapper.STRING, val: username },
        password: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.STRING },
        user_id: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.STRING },
      },
      {},
    );

    const id = result.outBinds?.user_id;
    const password = result.outBinds?.password;
    if (id === undefined || password === undefined) return undefined;
    return { _id: id, username, password };
  }
}
