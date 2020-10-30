import Model from './model';
import { IContributor, IContributorInput, IContributorKey } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async AddContributor(
    contributorKey: IContributorKey,
    contributorInput: IContributorInput,
  ): Promise<IContributor | undefined> {
    try {
      const record = await this._model.FindOne(contributorKey);
      if (record !== undefined) return undefined;

      return await this._model.Create(contributorKey, contributorInput);
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
