import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import { IProject, IProjectInput } from './types';
import oracledb from 'oracledb';

export default class Model {
  async Create(project: IProjectInput): Promise<IProject | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ project_id: number, error: number }>(
      `BEGIN insertProject(p_project_name => :p1, p_owner_id => :p2, p_project_id => :project_id, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: project.project_name },
        p2: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: project.user_id },
        project_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true },
    );

    const error = result.outBinds?.error;
    if (error !== 0) return undefined;

    const project_id = result.outBinds?.project_id;
    if (project_id === undefined) return undefined;
    return {project_id, owner_id: project.user_id, ...project };
  }

  async FindOne(projectName: string): Promise<IProject | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ owner_id: number, project_id: number, error: number }>(
      `BEGIN getProject(p_project_name => :p1, p_owner_id => :owner_id, p_project_id => :project_id, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: projectName },
        owner_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        project_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      {},
    );

    const error = result.outBinds?.error;
    if (error !== 0) return undefined;

    const owner_id = result.outBinds?.owner_id;
    const project_id = result.outBinds?.project_id;
    if (owner_id === undefined || project_id === undefined) return undefined;
    return {owner_id, project_id, project_name: projectName };
  }

  async FindAll(userId: number): Promise<IProject[] | undefined> {
    const result = await oracledbWrapper.simpleExecute<{ceva: any, error: number }>(
      `BEGIN getProjects(p_user_id => :p1, p_ref_projects => :ref_projects, p_error => :error); END;`,
      {
        p1: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: userId },
        _: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        error: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      {},
    );

    const error = result.outBinds?.error;
    if (error !== 0) return undefined;

    const ceva = result.outBinds?.ceva;
        // tslint:disable-next-line: no-console
        console.log(ceva);
    if (ceva === undefined) return undefined;
    return ceva;
  };
}
