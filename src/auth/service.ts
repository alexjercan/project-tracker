import Model from './model';
import { IUser, IUserInput } from './types';
import passport from 'passport';

export default class Service {
  constructor(private _model: Model) {
    passport.serializeUser((user: IUser, done) => {
      done(null, user.username);
    });

    passport.deserializeUser((username: string, done) => {
      this._model
        .FindOne(username)
        .then((user) => done(null, user))
        .catch((error) => done(error, false));
    });
  }

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
