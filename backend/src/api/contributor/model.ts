import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import oracledb from 'oracledb';
import { IContributor } from './types';

export default class Model {
  async Create(
    projectName: string,
    ownerUsername: string,
    contributorUsername: string,
  ): Promise<IContributor | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ error: number }>(
      `BEGIN insertContributor(p_project_name => :project_name, p_owner_username => :owner_username, p_contributor_username => :contributor_username, p_error => :error); END;`,
      {
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectName },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: ownerUsername },
        contributor_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: contributorUsername },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return { projectName, ownerUsername, contributorUsername };
  }

  async FindOne(
    projectName: string,
    ownerUsername: string,
    contributorUsername: string,
  ): Promise<IContributor | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ error: number }>(
      `BEGIN doesContributorExists(p_project_name => :project_name, p_owner_username => :owner_username, p_contributor_username => :contributor_username, p_error => :error); END;`,
      {
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectName },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: ownerUsername },
        contributor_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: contributorUsername },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return { projectName, ownerUsername, contributorUsername };
  }

  async FindAll(ownerUsername: string, projectName: string): Promise<IContributor[] | undefined> {
    const rowToObject = (record: any[]): IContributor | undefined => {
      if (record === undefined) return undefined;
      return {
        projectName: record[0],
        contributorUsername: record[1],
        ownerUsername,
      };
    };

    const connection = await oracledbWrapper.getConnection();
    const result = await connection.execute<{ cursor: oracledb.ResultSet<any>; error: number }>(
      `BEGIN getContributors(p_owner_username => :owner_username, p_project_name => :project_name, p_cursor => :cursor, p_error => :error); END;`,
      {
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: ownerUsername },
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectName },
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
    const rows: IContributor[] = [];
    while (row !== undefined) {
      rows.push(row);
      row = rowToObject(await cursor.getRow());
    }

    await cursor.close();
    await connection.close();
    return rows;
  }
}
