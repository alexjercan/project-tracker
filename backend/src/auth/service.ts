import Model from './model';
import { IUser } from './types';
import bcrypt from 'bcrypt';
import { dotenv } from '../config';

export default class Service {
  constructor(private _model: Model) {}

  async SignUp(username: string, password: string): Promise<IUser | undefined> {
    try {
      const record = await this._model.FindOne(username);
      if (record !== undefined) return undefined;

      const hashPassword: string = await bcrypt.hash(password, dotenv.auth.rounds);

      return await this._model.Create(username, hashPassword);
    } catch (error) {
      throw error;
    }
  }

  async SignIn(username: string, password: string): Promise<IUser | undefined> {
    try {
      const record = await this._model.FindOne(username);
      if (record === undefined) return undefined;

      const validPassword = await bcrypt.compare(password, record.password);
      if (!validPassword) return undefined;

      return record;
    } catch (error) {
      throw error;
    }
  }
}
