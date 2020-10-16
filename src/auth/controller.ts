import { NextFunction, Request, Response } from 'express';
import Service from './service';
import jwt from 'jsonwebtoken';
import { dotenv } from '../config';

export default class Controller {
  constructor(private _service: Service) {}

  async SignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await this._service.SignUp(req.body);
      if (userData === undefined) return res.status(200).send('Invalid SignUp');

      const token = jwt.sign({ username: userData.username }, dotenv.auth.secret);

      return res.header('auth-token', token).status(200).send('Authentication Successful');
    } catch (error) {
      res.status(500).send(error);
      next(error);
    }
  }

  async SignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const userRecord = await this._service.SignIn(req.body);
      if (userRecord === undefined) return res.status(200).send('Invalid SignIn');

      const token = jwt.sign({ username: userRecord.username }, dotenv.auth.secret);

      return res.header('auth-token', token).status(200).send('Authentication Successful');
    } catch (error) {
      res.status(500).send(error);
      next(error);
    }
  }
}
