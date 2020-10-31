import Service from './service';
import { NextFunction, Request, Response } from 'express';
import { IVerified } from '@alexjercan/jwt-wrapper';
import { IContributorKey, ITokenUser } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  async AddContributor(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;
    const { project_name, contributor_username }: IContributorKey = req.body as IContributorKey;

    try {
      const contributorData = await this._service.AddContributor(
        {
          project_name,
          owner_username: username,
          contributor_username,
        },
        {},
      );
      if (contributorData === undefined) return res.status(401).send({ message: 'Invalid Contributor' });

      req.body.contributors = [contributorData];
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async GetContributors(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { owner_username, project_name }: IContributorKey = req.body as IContributorKey;

    try {
      const contributorsData = await this._service.GetContributors(owner_username, project_name);
      if (contributorsData === undefined) return res.status(401).send({ message: 'Invalid Contributor' });

      req.body.contributors = contributorsData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
