import { NextFunction, Request, Response } from 'express';
import { IVerified } from '@alexjercan/jwt-wrapper';
import Service from './service';
import { ITokenUser } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  ShowName(req: Request, res: Response, next: NextFunction) {
    const verified = req.body.verified as IVerified;
    const user = verified.user as ITokenUser;

    return res.status(200).send({ username: user.username });
  }
}
