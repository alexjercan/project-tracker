import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { IVerified } from '@alexjercan/jwt-wrapper';
import { IRepositoryKey, ITokenUser } from './types';
import { IRepositoryInput } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  async GetRepository(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;
    const { owner_username, project_name }: IRepositoryKey = req.body as IRepositoryKey;

    try {
      const repositoryData = await this._service.GetRepository({ username, owner_username, project_name });
      if (repositoryData === undefined) return res.status(401).send({ message: 'Invalid Repository' });

      req.body.repository = repositoryData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async EditRepository(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;
    const { owner_username, project_name }: IRepositoryKey = req.body as IRepositoryKey;
    const { description, deadline }: IRepositoryInput = req.body as IRepositoryInput;

    try {
      const repositoryData = await this._service.EditRepository(
        { username, owner_username, project_name },
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
