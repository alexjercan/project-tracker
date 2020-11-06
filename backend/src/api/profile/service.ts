import Model from './model';
import { IProfile } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async EditProfile(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<IProfile | undefined> {
    try {
      return await this._model.Edit(username, firstName, lastName, email);
    } catch (error) {
      throw error;
    }
  }

  async GetProfile(username: string): Promise<IProfile | undefined> {
    try {
      return await this._model.FindOne(username);
    } catch (error) {
      throw error;
    }
  }
}
