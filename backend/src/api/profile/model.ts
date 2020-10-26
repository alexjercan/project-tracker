import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import oracledb from 'oracledb';
import {IProfile, IProfileInput, IProfileKey} from './types';

export default class Model {
  async Edit(profileKey: IProfileKey, profile: IProfileInput): Promise<IProfile | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ error: number }>(
      `BEGIN editProfile(p_user_id => :p1, p_first_name => :p2, p_last_name => :p3, p_email => :p4, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: profileKey.user_id },
        p2: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: profile.first_name },
        p3: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: profile.last_name },
        p4: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: profile.email },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return { email: profile.email, last_name: profile.last_name, first_name: profile.first_name };
  }

  async Get(profileKey: IProfileKey): Promise<IProfile | undefined> {
    const result = await oracledbWrapper.simpleExecute<{
      first_name: string;
      last_name: string;
      email: string;
      error: number;
    }>(
      `BEGIN getProfile(p_user_id => :p1, p_first_name => :first_name, p_last_name => :last_name, p_email => :email, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: profileKey.user_id },
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
      email: result.outBinds.email,
      first_name: result.outBinds.first_name,
      last_name: result.outBinds.last_name,
    };
  }
}
