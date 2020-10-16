import { NextFunction, Request, Response } from 'express';
import { IVerified } from '../token';
import Service from './service';

export default class Controller {
  constructor(private _service: Service) {}

  ShowName(req: Request, res: Response, next: NextFunction) {
    const verified = req.body.verified as IVerified;
    return res.status(200).send('peepeepoopoo ' + verified.username);
  }
}
