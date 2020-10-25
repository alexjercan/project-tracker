import { IVerified } from '@alexjercan/jwt-wrapper';
import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { IProfileInput, ITokenUser } from './types';

interface IUserInput {
  first_name: string;
  last_name: string;
  email: string;
}

export default class Controller {
  constructor(private _service: Service) {}

  async EditProfile(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { user_id }: ITokenUser = user as ITokenUser;
    const { email, first_name, last_name }: IUserInput = req.body;

    const profileInput: IProfileInput = { email, first_name, last_name, user_id: user_id };

    try {
      const profileData = await this._service.EditProfile(profileInput);
      if (profileData === undefined) return res.status(401).send({ message: 'Invalid Profile' });

      req.body.profile = profileData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async GetProfile(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { user_id }: ITokenUser = user as ITokenUser;

    try {
      const profileData = await this._service.GetProfile(user_id);
      if (profileData === undefined) return res.status(401).send({ message: 'Invalid Profile' });

      req.body.profile = profileData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
