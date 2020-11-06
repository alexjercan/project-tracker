import { IRepository } from './types';
import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import oracledb from 'oracledb';

export default class Model {
  async FindOne(username: string, ownerUsername: string, projectName: string): Promise<IRepository | undefined> {
    const result = await oracledbWrapper.simpleExecute<{
      description: string;
      started: string;
      deadline: string;
      last_modified: string;
      error: number;
    }>(
      `BEGIN getRepository(p_username => :username, p_owner_username => :owner_username, p_project_name => :project_name, p_description => :description, p_started => :started, p_deadline => :deadline, p_last_modified => :last_modified, p_error => :error); END;`,
      {
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: ownerUsername },
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectName },
        description: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        started: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        deadline: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        last_modified: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return {
      ownerUsername,
      projectName,
      description: result.outBinds.description,
      started: result.outBinds.started,
      deadline: result.outBinds.deadline,
      lastModified: result.outBinds.last_modified,
    };
  }

  async Edit(
    username: string,
    ownerUsername: string,
    projectName: string,
    description: string,
    deadline: string,
  ): Promise<IRepository | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ started: string; last_modified: string; error: number }>(
      `BEGIN editRepository(p_username => :username, p_owner_username => :owner_username, p_project_name => :project_name, p_description => :description, p_deadline => :deadline, p_started => :started, p_last_modified => :last_modified, p_error => :error); END;`,
      {
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: ownerUsername },
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectName },
        description: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: description },
        deadline: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: deadline },
        started: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        last_modified: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    if (result.outBinds === undefined) return undefined;

    const error = result.outBinds.error;
    if (error !== 0) return undefined;

    return {
      ownerUsername,
      projectName,
      description,
      deadline,
      started: result.outBinds.started,
      lastModified: result.outBinds.last_modified,
    };
  }
}
