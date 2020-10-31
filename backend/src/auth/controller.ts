import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { IUserInput, IUserKey } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  async SignUp(req: Request, res: Response, next: NextFunction) {
    const { username }: IUserKey = req.body as IUserKey;
    const { password }: IUserInput = req.body as IUserInput;

    try {
      const userData = await this._service.SignUp({ username }, { password });
      if (userData === undefined) return res.status(401).send({ message: 'Invalid SignUp' });

      req.body.user = userData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async SignIn(req: Request, res: Response, next: NextFunction) {
    const { username }: IUserKey = req.body as IUserKey;
    const { password }: IUserInput = req.body as IUserInput;

    try {
      const userRecord = await this._service.SignIn({ username }, { password });
      if (userRecord === undefined) return res.status(401).send({ message: 'Invalid SignIn' });

      req.body.user = userRecord;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
