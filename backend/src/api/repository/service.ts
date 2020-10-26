import Model from './model';
import {IRepositoryKey, IRepository, IRepositoryInput} from './types';

export default class Service {
  constructor(private _model: Model) {}

  async GetRepository(repositoryKey: IRepositoryKey): Promise<IRepository | undefined> {
    try {
      return await this._model.FindOne(repositoryKey);
    } catch (error) {
      throw error;
    }
  }

  async EditRepository(repositoryKey: IRepositoryKey, repositoryInput: IRepositoryInput): Promise<IRepository | undefined> {
    try {
      return await this._model.Edit(repositoryKey, repositoryInput);
    } catch (error) {
      throw error;
    }
  }
}
