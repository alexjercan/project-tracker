import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import oracledb from 'oracledb';
import { IContributor, IContributorInput, IContributorKey } from './types';

export default class Model {
  async Create(
    contributorKey: IContributorKey,
    contributorInput: IContributorInput,
  ): Promise<IContributor | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ error: number }>(
      `BEGIN insertContributor(p_project_name => :project_name, p_owner_username => :owner_username, p_contributor_username => :contributor_username, p_error => :error); END;`,
      {
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: contributorKey.project_name },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: contributorKey.owner_username },
        contributor_username: {
          dir: oracledb.BIND_IN,
          type: oracledb.STRING,
          val: contributorKey.contributor_username,
        },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return { ...contributorKey, ...contributorInput };
  }

  async FindOne(contributorKey: IContributorKey): Promise<IContributor | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ error: number }>(
      `BEGIN doesContributorExists(p_project_name => :project_name, p_owner_username => :owner_username, p_contributor_username => :contributor_username, p_error => :error); END;`,
      {
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: contributorKey.project_name },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: contributorKey.owner_username },
        contributor_username: {
          dir: oracledb.BIND_IN,
          type: oracledb.STRING,
          val: contributorKey.contributor_username,
        },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return { ...contributorKey };
  }

  async FindAll(owner_username: string, project_name: string): Promise<IContributor[] | undefined> {
    const rowToObject = (record: any[]): IContributor | undefined => {
      if (record === undefined) return undefined;
      return {
        project_name: record[0],
        contributor_username: record[1],
        owner_username,
      };
    };

    const connection = await oracledbWrapper.getConnection();
    const result = await connection.execute<{ cursor: oracledb.ResultSet<any>; error: number }>(
      `BEGIN getContributors(p_owner_username => :owner_username, p_project_name => :project_name, p_cursor => :cursor, p_error => :error); END;`,
      {
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: owner_username },
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: project_name },
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
