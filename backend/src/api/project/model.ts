import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import { IProject, IProjectKey } from './types';
import oracledb from 'oracledb';

export default class Model {
  async Create(projectKey: IProjectKey): Promise<IProject | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ username: string; error: number }>(
      `BEGIN insertProject(p_project_name => :p1, p_owner_id => :p2, p_username => :username, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectKey.project_name },
        p2: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: projectKey.user_id },
        username: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;
    
    const username = result.outBinds.username;
    if (username === undefined) return undefined;

    return { project_name: projectKey.project_name, username };
  }

  async FindOne(projectInput: IProjectKey): Promise<IProject | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ username: string; error: number }>(
      `BEGIN getProjectOwner(p_project_name => :p1, p_user_id => :p2, p_username => :username, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectInput.project_name },
        p2: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: projectInput.user_id },
        username: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      {},
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    const username = result.outBinds.username;
    if (username === undefined) return undefined;
    return { project_name: projectInput.project_name, username };
  }

  async FindAll(userId: number): Promise<IProject[] | undefined> {
    const rowToObject = (record: any[]): IProject | undefined => {
      if (record === undefined) return undefined;
      return {
        project_name: record[0],
        username: record[1],
      };
    };

    const connection = await oracledbWrapper.getConnection();
    const result = await connection.execute<{ cursor: oracledb.ResultSet<any>; error: number }>(
      `BEGIN getProjects(p_user_id => :p1, p_cursor => :cursor, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      {},
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    const cursor = result.outBinds.cursor;
    let row = rowToObject(await cursor.getRow());
    const rows: IProject[] = [];
    while (row !== undefined) {
      rows.push(row);
      row = rowToObject(await cursor.getRow());
    }

    await cursor.close();
    await connection.close();
    return rows;
  }
}
