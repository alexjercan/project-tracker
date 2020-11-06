import Model from './model';
import { IContributor } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async AddContributor(
    projectName: string,
    ownerUsername: string,
    contributorUsername: string,
  ): Promise<IContributor | undefined> {
    try {
      const record = await this._model.FindOne(projectName, ownerUsername, contributorUsername);
      if (record !== undefined) return undefined;

      return await this._model.Create(projectName, ownerUsername, contributorUsername);
    } catch (error) {
      throw error;
    }
  }

  async GetContributors(ownerUsername: string, projectName: string): Promise<IContributor[] | undefined> {
    try {
      return await this._model.FindAll(ownerUsername, projectName);
    } catch (error) {
      throw error;
    }
  }
}
