import Model from './model';
import { IUser, IUserInput, IUserKey } from './types';
import bcrypt from 'bcrypt';
import { dotenv } from '../config';

export default class Service {
  constructor(private _model: Model) {}

  async SignUp(userKey: IUserKey, userInput: IUserInput): Promise<IUser | undefined> {
    try {
      const record = await this._model.FindOne(userKey);
      if (record !== undefined) return undefined;

      const password: string = await bcrypt.hash(userInput.password, dotenv.auth.rounds);

      return await this._model.Create(userKey, { password });
    } catch (error) {
      throw error;
    }
  }

  async SignIn(userKey: IUserKey, userInput: IUserInput): Promise<IUser | undefined> {
    try {
      const record = await this._model.FindOne(userKey);
      if (record === undefined) return undefined;

      const validPassword = await bcrypt.compare(userInput.password, record.password);
      if (!validPassword) return undefined;

      return record;
    } catch (error) {
      throw error;
    }
  }
}
