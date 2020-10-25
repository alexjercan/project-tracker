import Model from './model';
import {IProjectInput, IRepository, IRepositoryInput} from './types';

export default class Service {
  constructor(private _model: Model) {}

  async GetRepository(projectInput: IProjectInput): Promise<IRepository | undefined> {
    try {
      return await this._model.FindOne(projectInput);
    } catch (error) {
      throw error;
    }
  }

  async EditRepository(repositoryInput: IRepositoryInput): Promise<IRepository | undefined> {
    try {
      return await this._model.Edit(repositoryInput);
    } catch (error) {
      throw error;
    }
  }
}
