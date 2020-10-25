import Model from './model';
import { IProfile, IProfileInput } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async EditProfile(profileInput: IProfileInput): Promise<IProfile | undefined> {
    try {
      return await this._model.Edit(profileInput);
    } catch (error) {
      throw error;
    }
  }

  async GetProfile(userId: number): Promise<IProfile | undefined> {
    try {
      return await this._model.Get(userId);
    } catch (error) {
      throw error;
    }
  }
}
