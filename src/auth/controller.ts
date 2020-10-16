import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { sign } from '../token';

export default class Controller {
  constructor(private _service: Service) {}

  async SignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await this._service.SignUp(req.body);
      if (userData === undefined) return res.status(200).send('Invalid SignUp');

      const token = sign({ username: userData.username });
      return res.header('auth-token', token).status(200).send('Authentication Successful');
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async SignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const userRecord = await this._service.SignIn(req.body);
      if (userRecord === undefined) return res.status(200).send('Invalid SignIn');

      const token = sign({ username: userRecord.username });
      return res.header('auth-token', token).status(200).send('Authentication Successful');
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
