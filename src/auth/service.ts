import Model from './model';
import { IUser, IUserInput } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async SignUp(userInput: IUserInput): Promise<IUser | undefined> {
    try {
      const userRecord = await this._model.Create(userInput);
      if (userRecord === undefined) return undefined;

      return userRecord;
    } catch (error) {
      throw error;
    }
  }

  async SignIn(userInput: IUserInput): Promise<IUser | undefined> {
    try {
      const userRecord = await this._model.FindOne(userInput.username);
      if (userRecord === undefined) return undefined;

      const validPassword = userRecord.password === userInput.password;
      if (!validPassword) return undefined;

      return userRecord;
    } catch (error) {
      throw error;
    }
  }
}
