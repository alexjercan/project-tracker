import { IProjectInput, IRepository, IRepositoryInput } from './types';
import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import oracledb from 'oracledb';

export default class Model {
  async FindOne(projectInput: IProjectInput): Promise<IRepository | undefined> {
    const result = await oracledbWrapper.simpleExecute<{
      description: string;
      progress: string;
      started: string;
      deadline: string;
      last_modified: string;
      error: number;
    }>(
      `BEGIN getRepository(p_user_id => :p1, p_project_name => :p2, p_description => :description, p_progress => :progress, p_started => :started, p_deadline => :deadline, p_last_modified => :last_modified, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: projectInput.user_id },
        p2: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectInput.project_name },
        description: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        progress: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
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

    const description = result.outBinds.description;
    const progress = result.outBinds.progress;
    const started = result.outBinds.started;
    const deadline = result.outBinds.deadline;
    const last_modified = result.outBinds.last_modified;

    return { description, progress, started, deadline, last_modified };
  }

  async Edit(repositoryInput: IRepositoryInput): Promise<IRepository | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ started: string; last_modified: string; error: number }>(
      `BEGIN editRepository(p_user_id => :p1, p_project_name => :p2, p_description => :p3, p_progress => :p4, p_deadline => :p5, p_started => :started, p_last_modified => :last_modified, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: repositoryInput.user_id },
        p2: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryInput.project_name },
        p3: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryInput.description },
        p4: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryInput.progress },
        p5: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: repositoryInput.deadline },
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
      description: repositoryInput.description,
      progress: repositoryInput.progress,
      started: result.outBinds.started,
      deadline: repositoryInput.deadline,
      last_modified: result.outBinds.last_modified,
    };
  }
}
