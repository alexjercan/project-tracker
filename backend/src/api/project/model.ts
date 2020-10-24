import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import { IProject, IProjectInput } from './types';

export default class Model {
  async Create(project: IProjectInput): Promise<IProject | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ project_id: number, error: number }>(
      `BEGIN insertProject(p_project_name => :p1, p_owner_id => :p2, p_project_id => :project_id, p_error => :error); END;`,
      {
        p1: { dir: oracledbWrapper.BIND_IN, type: oracledbWrapper.STRING, val: project.project_name },
        p2: { dir: oracledbWrapper.BIND_IN, type: oracledbWrapper.NUMBER, val: project.user_id },
        project_id: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.NUMBER },
        error: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.NUMBER },
      },
      { autoCommit: true },
    );

    const error = result.outBinds?.error;
    if (error !== 0) return undefined;

    const project_id = result.outBinds?.project_id;
    return {project_id, owner_id: project.user_id, ...project };
  }

  async FindOne(projectName: string): Promise<IProject | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ owner_id: number, project_id: number, error: number }>(
      `BEGIN getProject(p_project_name => :p1, p_owner_id => :owner_id, p_project_id => :project_id, p_error => :error); END;`,
      {
        p1: { dir: oracledbWrapper.BIND_IN, type: oracledbWrapper.STRING, val: projectName },
        owner_id: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.NUMBER },
        project_id: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.NUMBER },
        error: { dir: oracledbWrapper.BIND_OUT, type: oracledbWrapper.NUMBER },
      },
      {},
    );

    const error = result.outBinds?.error;
    if (error !== 0) return undefined;

    const owner_id = result.outBinds?.owner_id;
    const project_id = result.outBinds?.project_id;
    return {owner_id, project_id, project_name: projectName };
  }
}
