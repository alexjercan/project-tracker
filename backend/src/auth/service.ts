import Model from './model';
import { IUser, IUserInput } from './types';
import bcrypt from 'bcrypt';
import { dotenv } from '../config';

export default class Service {
  constructor(private _model: Model) {}

  async SignUp(userInput: IUserInput): Promise<IUser | undefined> {
    try {
      const record = await this._model.FindOne(userInput.username);
      if (record !== undefined) return undefined;

      const encryptedPassword: string = await bcrypt.hash(userInput.password, dotenv.auth.rounds);
      const userInputSecure: IUserInput = { username: userInput.username, password: encryptedPassword };

      const createdRecord = await this._model.Create(userInputSecure);
      if (createdRecord === undefined) return undefined;

      return createdRecord;
    } catch (error) {
      throw error;
    }
  }

  async SignIn(userInput: IUserInput): Promise<IUser | undefined> {
    try {
      const record = await this._model.FindOne(userInput.username);
      if (record === undefined) return undefined;

      const validPassword = await bcrypt.compare(userInput.password, record.password);
      if (!validPassword) return undefined;

      return record;
    } catch (error) {
      throw error;
    }
  }
}
