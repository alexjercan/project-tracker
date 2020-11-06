import Model from './model';
import { IProject } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async CreateProject(username: string, projectName: string): Promise<IProject | undefined> {
    try {
      const record = await this._model.FindOne(username, projectName);
      if (record !== undefined) return undefined;

      return await this._model.Create(username, projectName);
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
