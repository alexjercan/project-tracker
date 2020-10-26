﻿import { IRepositoryKey, IRepository, IRepositoryInput } from './types';
import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import oracledb from 'oracledb';

export default class Model {
  async FindOne(repositoryKey: IRepositoryKey): Promise<IRepository | undefined> {
    const result = await oracledbWrapper.simpleExecute<{
      description: string;
      started: string;
      deadline: string;
      last_modified: string;
      error: number;
    }>(
      `BEGIN getRepository(p_username => :username, p_owner_username => :owner_username, p_project_name => :project_name, p_description => :description, p_started => :started, p_deadline => :deadline, p_last_modified => :last_modified, p_error => :error); END;`,
      {
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryKey.username },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryKey.owner_username },
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryKey.project_name },
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
      ...repositoryKey,
      description: result.outBinds.description,
      started: result.outBinds.started,
      deadline: result.outBinds.deadline,
      last_modified: result.outBinds.last_modified,
    };
  }

  async Edit(repositoryKey: IRepositoryKey, repositoryInput: IRepositoryInput): Promise<IRepository | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ started: string; last_modified: string; error: number }>(
      `BEGIN editRepository(p_username => :username, p_owner_username => :owner_username, p_project_name => :project_name, p_description => :description, p_deadline => :deadline, p_started => :started, p_last_modified => :last_modified, p_error => :error); END;`,
      {
        username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryKey.username },
        owner_username: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryKey.owner_username },
        project_name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryKey.project_name },
        description: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryInput.description },
        deadline: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryInput.deadline },
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
      ...repositoryKey,
      ...repositoryInput,
      started: result.outBinds.started,
      last_modified: result.outBinds.last_modified,
    };
  }
}
