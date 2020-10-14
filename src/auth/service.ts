import Model from './model';
import { IUser, IUserInput } from './types';
import { EventEmitter } from 'events';

export default class Service {
  public eventEmitter: EventEmitter = new EventEmitter();

  constructor(private _model: Model) {}

  async SignUp(userInput: IUserInput): Promise<IUser | undefined> {
    try {
      // TODO hash password, etc...
      const userRecord = await this._model.Create(userInput);
      if (userRecord === undefined) return undefined;

      this.eventEmitter.emit('signedUp', userRecord);
      return userRecord;
    } catch (error) {
      throw error;
    }
  }

  async SignIn(userInput: IUserInput): Promise<IUser | undefined> {
    try {
      // TODO error handling
      const userRecord = await this._model.FindOne(userInput.username);
      if (userRecord === undefined) return undefined;

      const validPassword = userRecord.password === userInput.password;
      if (!validPassword) return undefined;

      // TODO generate tokens, etc...
      this.eventEmitter.emit('signedIn', userRecord);
      return userRecord;
    } catch (error) {
      throw error;
    }
  }
}
