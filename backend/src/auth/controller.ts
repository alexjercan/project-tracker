import { NextFunction, Request, Response } from 'express';
import Service from './service';

export default class Controller {
  constructor(private _service: Service) {}

  async SignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await this._service.SignUp(req.body);
      if (userData === undefined) return res.status(401).send({ message: 'Invalid SignUp' });

      req.body.user = userData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async SignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const userRecord = await this._service.SignIn(req.body);
      if (userRecord === undefined) return res.status(401).send({ message: 'Invalid SignUp' });

      req.body.user = userRecord;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
