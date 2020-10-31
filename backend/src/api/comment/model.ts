import { IComment, ICommentKey, ICommentInput } from './types';
import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import oracledb from 'oracledb';

export default class Model {
  async Create(commentKey: ICommentKey, commentInput: ICommentInput): Promise<IComment | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ timestamp: string; error: number }>(
      `BEGIN insertComment(p_owner_username => :owner_username, p_project_name => :project_name, p_username => :username, p_description => :description, p_timestamp => :timestamp, p_error => :error); END;`,
      {
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: commentKey.owner_username },
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: commentKey.project_name },
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: commentKey.username },
        description: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: commentInput.description },
        timestamp: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    const timestamp = result.outBinds.timestamp;
    if (timestamp === undefined) return undefined;

    return { ...commentKey, ...commentInput, timestamp };
  }

  async FindAll(ownerUsername: string, projectName: string, username: string): Promise<IComment[] | undefined> {
    const rowToObject = (record: any[]): IComment | undefined => {
      if (record === undefined) return undefined;
      return {
        username: record[0],
        description: record[1],
        timestamp: record[2],
        project_name: projectName,
        owner_username: ownerUsername,
      };
    };

    const connection = await oracledbWrapper.getConnection();
    const result = await connection.execute<{ cursor: oracledb.ResultSet<any>; error: number }>(
      `BEGIN getComments(p_username => :username, p_owner_username => :owner_username, p_project_name => :project_name, p_cursor => :cursor, p_error => :error); END;`,
      {
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: ownerUsername },
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectName },
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      {},
    );
    if (result.outBinds === undefined) {
      await connection.close();
      return undefined;
    }

    const cursor = result.outBinds.cursor;
    const error = result.outBinds.error;

    if (error !== 0) {
      await cursor.close();
      await connection.close();
      return undefined;
    }

    let row = rowToObject(await cursor.getRow());
    const rows: IComment[] = [];
    while (row !== undefined) {
      rows.push(row);
      row = rowToObject(await cursor.getRow());
    }

    await cursor.close();
    await connection.close();
    return rows;
  }
}
