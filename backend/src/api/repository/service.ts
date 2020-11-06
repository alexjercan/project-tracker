import Model from './model';
import { IRepository } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async GetRepository(username: string, ownerUsername: string, projectName: string): Promise<IRepository | undefined> {
    try {
      return await this._model.FindOne(username, ownerUsername, projectName);
    } catch (error) {
      throw error;
    }
  }

  async EditRepository(
    username: string,
    ownerUsername: string,
    projectName: string,
    description: string,
    deadline: string,
  ): Promise<IRepository | undefined> {
    try {
      return await this._model.Edit(username, ownerUsername, projectName, description, deadline);
    } catch (error) {
      throw error;
    }
  }
}
