import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import oracledb from 'oracledb';
import { IProfile, IProfileInput, IProfileKey } from './types';

export default class Model {
  async Edit(profileKey: IProfileKey, profileInput: IProfileInput): Promise<IProfile | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ error: number }>(
      `BEGIN editProfile(p_username => :username, p_first_name => :first_name, p_last_name => :last_name, p_email => :email, p_error => :error); END;`,
      {
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: profileKey.username },
        first_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: profileInput.first_name },
        last_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: profileInput.last_name },
        email: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: profileInput.email },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return { ...profileKey, ...profileInput };
  }

  async Get(profileKey: IProfileKey): Promise<IProfile | undefined> {
    const result = await oracledbWrapper.simpleExecute<{
      first_name: string;
      last_name: string;
      email: string;
      error: number;
    }>(
      `BEGIN getProfile(p_username => :username, p_first_name => :first_name, p_last_name => :last_name, p_email => :email, p_error => :error); END;`,
      {
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: profileKey.username },
        first_name: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        last_name: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        email: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return {
      ...profileKey,
      email: result.outBinds.email,
      first_name: result.outBinds.first_name,
      last_name: result.outBinds.last_name,
    };
  }
}
