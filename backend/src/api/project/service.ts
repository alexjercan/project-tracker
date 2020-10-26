import Model from './model';
import { IProject, IProjectKey } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async CreateProject(projectKey: IProjectKey): Promise<IProject | undefined> {
    try {
      const record = await this._model.FindOne(projectKey);
      if (record !== undefined) return undefined;

      return await this._model.Create(projectKey);
    } catch (error) {
      throw error;
    }
  }

  async GetProjects(userId: number): Promise<IProject[] | undefined> {
    try {
      return await this._model.FindAll(userId);
    } catch (error) {
      throw error;
    }
  }
}
