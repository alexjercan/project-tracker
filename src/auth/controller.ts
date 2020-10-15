import { NextFunction, Request, Response } from 'express';
import Service from './service';
import Model from './model';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { IUser } from './types';

const model = new Model();
const service = new Service(model);

passport.use(
  'local',
  new Strategy(async (username, password, done) => {
    try {
      const user: IUser | undefined = await service.SignIn({ username, password });

      if (user === undefined) return done(null, false, { message: 'Invalid Credentials.\n' });

      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await service.SignUp(req.body);
    if (userData === undefined) return res.status(200).send('Invalid SignUp');

    res.status(200).json(userData);
    next(userData);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (error, user, info) => {
    if (info) return res.send(info.message);
    if (error) return next(error);
    if (!user) return res.status(200).send('Authentication Error');
    
    req.login(user, (error) => {
      if (error) return next(error);
      return res.status(200).send('Authentication Successful');
    });
  });
};

export const logOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO service.Logout(req.body);
    return res.status(200).end();
  } catch (error) {
    res.status(500);
    next(error);
  }
};
