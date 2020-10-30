import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import { IProject, IProjectInput, IProjectKey } from './types';
import oracledb from 'oracledb';

export default class Model {
  async Create(projectKey: IProjectKey, projectInput: IProjectInput): Promise<IProject | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ error: number }>(
      `BEGIN insertProject(p_project_name => :project_name, p_owner_username => :owner_username, p_error => :error); END;`,
      {
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectKey.project_name },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectKey.owner_username },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return { ...projectKey, ...projectInput };
  }

  async FindOne(projectKey: IProjectKey): Promise<IProject | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ error: number }>(
      `BEGIN doesProjectExists(p_project_name => :project_name, p_owner_username => :owner_username, p_error => :error); END;`,
      {
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectKey.project_name },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectKey.owner_username },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      {},
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return { ...projectKey };
  }

  async FindAll(username: string): Promise<IProject[] | undefined> {
    const rowToObject = (record: any[]): IProject | undefined => {
      if (record === undefined) return undefined;
      return {
        project_name: record[0],
        owner_username: record[1],
      };
    };

    const connection = await oracledbWrapper.getConnection();
    const result = await connection.execute<{ cursor: oracledb.ResultSet<any>; error: number }>(
      `BEGIN getProjects(p_username => :username, p_cursor => :cursor, p_error => :error); END;`,
      {
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
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
