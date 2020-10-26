import Model from './model';
import {IProfile, IProfileKey} from './types';

export default class Service {
  constructor(private _model: Model) {}

  async EditProfile(profileKey: IProfileKey, profileInput: IProfile): Promise<IProfile | undefined> {
    try {
      return await this._model.Edit(profileKey, profileInput);
    } catch (error) {
      throw error;
    }
  }

  async GetProfile(profileKey: IProfileKey): Promise<IProfile | undefined> {
    try {
      return await this._model.Get(profileKey);
    } catch (error) {
      throw error;
    }
  }
}
