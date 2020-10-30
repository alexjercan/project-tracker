import { IVerified } from '@alexjercan/jwt-wrapper';
import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { IProfileInput, ITokenUser } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  async EditProfile(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;
    const { first_name, last_name, email }: IProfileInput = req.body as IProfileInput;

    try {
      const profileData = await this._service.EditProfile({ username }, { first_name, last_name, email });
      if (profileData === undefined) return res.status(401).send({ message: 'Invalid Profile' });

      req.body.profile = profileData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async GetProfile(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;

    try {
      const profileData = await this._service.GetProfile({ username });
      if (profileData === undefined) return res.status(401).send({ message: 'Invalid Profile' });

      req.body.profile = profileData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
