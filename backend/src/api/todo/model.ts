import { ITodo } from './types';
import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import oracledb from 'oracledb';

export default class Model {
  async Create(
    ownerUsername: string,
    projectName: string,
    username: string,
    description: string,
  ): Promise<ITodo | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ todo_id: number; error: number }>(
      `BEGIN insertTodo(p_owner_username => :owner_username, p_project_name => :project_name, p_username => :username, p_description => :description, p_todo_id => :todo_id, p_error => :error); END;`,
      {
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: ownerUsername },
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectName },
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
        description: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: description },
        todo_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    const todoId = result.outBinds.todo_id;
    if (todoId === undefined) return undefined;

    return { todoId, ownerUsername, projectName, description, completedBy: undefined, timestamp: undefined };
  }

  async Complete(
    todoId: number,
    ownerUsername: string,
    projectName: string,
    username: string,
  ): Promise<ITodo | undefined> {
    const result = await oracledbWrapper.simpleExecute<{
      description: string;
      completed_by: string;
      timestamp: string;
      error: number;
    }>(
      `BEGIN completeTodo(p_todo_id => :todo_id, p_owner_username => :owner_username, p_project_name => :project_name, p_username => :username, p_description => :description, p_completed_by => :completed_by, p_timestamp => :timestamp, p_error => :error); END;`,
      {
        todo_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: todoId },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: ownerUsername },
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectName },
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
        description: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        completed_by: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        timestamp: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    const description = result.outBinds.description;
    if (description === undefined) return undefined;

    const completedBy = result.outBinds.completed_by;
    if (completedBy === undefined) return undefined;

    const timestamp = result.outBinds.timestamp;
    if (timestamp === undefined) return undefined;

    return { todoId, ownerUsername, projectName, description, completedBy, timestamp };
  }

  async FindAll(ownerUsername: string, projectName: string, username: string): Promise<ITodo[] | undefined> {
    const rowToObject = (record: any[]): ITodo | undefined => {
      if (record === undefined) return undefined;
      return {
        ownerUsername,
        projectName,
        todoId: record[0],
        description: record[1],
        completedBy: record[2],
        timestamp: record[3],
      };
    };

    const connection = await oracledbWrapper.getConnection();
    const result = await connection.execute<{ cursor: oracledb.ResultSet<any>; error: number }>(
      `BEGIN getTodos(p_username => :username, p_owner_username => :owner_username, p_project_name => :project_name, p_cursor => :cursor, p_error => :error); END;`,
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
    const rows: ITodo[] = [];
    while (row !== undefined) {
      rows.push(row);
      row = rowToObject(await cursor.getRow());
    }

    await cursor.close();
    await connection.close();
    return rows;
  }
}
