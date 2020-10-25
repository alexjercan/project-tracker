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
    const verified = req.body.verified as IVerified;
    const user = verified.user as ITokenUser;
    const userInput: IUserInput = req.body;

    const profileInput: IProfileInput = { user_id: user.user_id, ...userInput};

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
    const verified = req.body.verified as IVerified;
    const user = verified.user as ITokenUser;

    try {
      const profileData = await this._service.GetProfile(user.user_id);
      if (profileData === undefined) return res.status(401).send({ message: 'Invalid Profile' });

      req.body.profile = profileData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
