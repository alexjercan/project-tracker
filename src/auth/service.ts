import Model from './model';
import { IUser, IUserInput } from './types';
import passport from 'passport';
import { Strategy } from 'passport-local';

export default class Service {
  constructor(private _model: Model) {
    passport.use(
      'local',
      new Strategy(async (username, password, done) => {
        try {
          const user: IUser | undefined = await this.SignIn({ username, password });

          if (user === undefined) return done(null, false, { message: 'Invalid Credentials.\n' });

          return done(null, user);
        } catch (error) {
          done(error);
        }
      }),
    );
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
