import Model from './model';
import {IContributor, IContributorInput, IContributorKey} from "./types";

export default class Service {
  constructor(private _model: Model) {}

  async AddContributor(contributorKey: IContributorKey, contributorInput: IContributorInput): Promise<IContributor | undefined> {
    try {
      const record = await this._model.FindOne(contributorKey);
      if (record !== undefined) return undefined;

      return await this._model.Create(contributorKey, contributorInput);
    } catch (error) {
      throw error;
    }
  }

  async GetContributors(owner_username: string, project_name: string): Promise<IContributor[] | undefined> {
    try {
      return await this._model.FindAll(owner_username, project_name);
    } catch (error) {
      throw error;
    }
  }
}