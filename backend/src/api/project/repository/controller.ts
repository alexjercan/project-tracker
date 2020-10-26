import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { IVerified } from '@alexjercan/jwt-wrapper';
import { ITokenUser } from './types';
import { IRepositoryInput } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  async GetRepository(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { user_id }: ITokenUser = user as ITokenUser;

    try {
      const repositoryData = await this._service.GetRepository({ user_id, project_name: req.body.project_name });
      if (repositoryData === undefined) return res.status(401).send({ message: 'Invalid Repository' });

      req.body.repository = repositoryData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async EditRepository(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { user_id }: ITokenUser = user as ITokenUser;
    const { description, deadline }: IRepositoryInput = req.body as IRepositoryInput;

    try {
      const repositoryData = await this._service.EditRepository(
        {
          user_id,
          project_name: req.body.project_name,
        },
        { description, deadline },
      );
      if (repositoryData === undefined) return res.status(401).send({ message: 'Invalid Repository' });

      req.body.repository = repositoryData;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  }
}
