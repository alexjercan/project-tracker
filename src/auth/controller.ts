import { NextFunction, Request, Response } from 'express';
import Service from './service';

export default class Controller {
  constructor(private _service: Service) {}

  async SignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await this._service.SignUp(req.body);
      return res.status(200).json(userData);
    } catch (error) {
      res.status(500);
      next(error);
    }
  }

  async SignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await this._service.SignIn(req.body);
      return res.status(200).json(userData);
    } catch (error) {
      res.status(500);
      next(error);
    }
  }

  async LogOut(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO service.Logout(req.body);
      return res.status(200).end();
    } catch (error) {
      res.status(500);
      next(error);
    }
  }
}
