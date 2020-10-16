import { NextFunction, Request, Response } from 'express';
import Service from './service';
import passport from 'passport';
import { IUser } from './types';

export default class Controller {
  constructor(private _service: Service) {
  }

  async SignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await this._service.SignUp(req.body);
      if (userData === undefined) return res.status(200).send('Invalid SignUp');

      req.login(userData, (error) => {
        if (error) return next(error);
        return res.status(200).send('Authentication Successful');
      });

    } catch (error) {
      res.status(500);
      next(error);
    }
  }

  async SignIn(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (error, user: IUser | undefined, info) => {
      if (info) return res.send(info.message);
      if (error) return next(error);
      if (!user) return res.status(200).send('Authentication Error');

      req.login(user, (error) => {
        if (error) return next(error);
        return res.status(200).send('Authentication Successful');
      });
    });
  }

  async LogOut(req: Request, res: Response, next: NextFunction) {
    try {
      req.logout();
      return res.status(200).send('Logout Successful');
    } catch (error) {
      res.status(500);
      next(error);
    }
  }
}
