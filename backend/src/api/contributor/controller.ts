import Service from './service';
import { NextFunction, Request, Response } from 'express';
import { IVerified } from '@alexjercan/jwt-wrapper';
import { ITokenUser } from './types';
import url from 'url';
import * as querystring from "querystring";

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
    const parsedUrl = url.parse(req.url);
    const {ownerUsername, projectName} = querystring.parse(parsedUrl.query ?? "") as {ownerUsername: string, projectName: string};

    try {
      const contributorsData = await this._service.GetContributors(ownerUsername, projectName);
      if (contributorsData === undefined) return res.status(401).send({ message: 'Invalid Contributor' });

      req.body.contributors = contributorsData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
