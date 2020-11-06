import Model from './model';
import { IComment } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async AddComment(
    ownerUsername: string,
    projectName: string,
    username: string,
    description: string,
  ): Promise<IComment | undefined> {
    try {
      return await this._model.Create(ownerUsername, projectName, username, description);
    } catch (error) {
      throw error;
    }
  }

  async GetComments(ownerUsername: string, projectName: string, username: string): Promise<IComment[] | undefined> {
    try {
      return await this._model.FindAll(ownerUsername, projectName, username);
    } catch (error) {
      throw error;
    }
  }
}
