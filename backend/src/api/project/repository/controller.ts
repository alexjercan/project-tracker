import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { IRepositoryInput } from './types';
import { IVerified } from '@alexjercan/jwt-wrapper';
import { ITokenUser } from './types';
import { IProjectInput } from './types';

interface IUserInput {
  project_name: string;
}

export default class Controller {
  constructor(private _service: Service) {}

  async GetRepository(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { user_id }: ITokenUser = user as ITokenUser;
    const { project_name }: IUserInput = req.body;

    const projectInput: IProjectInput = { user_id, project_name };

    try {
      const repositoryData = await this._service.GetRepository(projectInput);
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
    const { project_name, description, progress, deadline }: IRepositoryInput = req.body;

    const repositoryInput: IRepositoryInput = { user_id, project_name, description, progress, deadline };

    try {
      const repositoryData = await this._service.EditRepository(repositoryInput);
      if (repositoryData === undefined) return res.status(401).send({ message: 'Invalid Repository' });

      req.body.repository = repositoryData;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  }
}
