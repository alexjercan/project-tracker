import Service from './service';
import { NextFunction, Request, Response } from 'express';
import { IVerified } from '@alexjercan/jwt-wrapper';
import { ITokenUser } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  async AddContributor(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;

    try {
      const contributorData = await this._service.AddContributor(
        req.body.projectName,
        username,
        req.body.contributorUsername,
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

    try {
      const contributorsData = await this._service.GetContributors(req.body.ownerUsername, req.body.projectName);
      if (contributorsData === undefined) return res.status(401).send({ message: 'Invalid Contributor' });

      req.body.contributors = contributorsData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
