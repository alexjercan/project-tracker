import Model from './model';
import { IProfile, IProfileInput } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async EditProfile(profileInput: IProfileInput): Promise<IProfile | undefined> {
    try {
      const record = await this._model.Edit(profileInput);
      if (record === undefined) return undefined;

      return record;
    } catch (error) {
      throw error;
    }
  }

  async GetProfile(userId: number): Promise<IProfile | undefined> {
    try {
      const record = await this._model.Get(userId);
      if (record === undefined) return undefined;

      return record;
    } catch (error) {
      throw error;
    }
  }
}