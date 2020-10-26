import Model from './model';
import {IProject, IProjectInput, IProjectKey} from './types';

export default class Service {
  constructor(private _model: Model) {}

  async CreateProject(projectKey: IProjectKey, projectInput: IProjectInput): Promise<IProject | undefined> {
    try {
      const record = await this._model.FindOne(projectKey);
      if (record !== undefined) return undefined;

      return await this._model.Create(projectKey, projectInput);
    } catch (error) {
      throw error;
    }
  }

  async GetProjects(username: string): Promise<IProject[] | undefined> {
    try {
      return await this._model.FindAll(username);
    } catch (error) {
      throw error;
    }
  }
}
