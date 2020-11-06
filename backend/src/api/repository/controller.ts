import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { IVerified } from '@alexjercan/jwt-wrapper';
import { ITokenUser } from './types';
const url = require('url');
const querystring = require('querystring');

export default class Controller {
  constructor(private _service: Service) {}

  async GetRepository(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;
    const parsedUrl = url.parse(req.url);
    const parsedQs = querystring.parse(parsedUrl.query);
    
    try {
      const repositoryData = await this._service.GetRepository(username, parsedQs.ownerUsername, parsedQs.projectName);
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

    try {
      const repositoryData = await this._service.EditRepository(
        username,
        req.body.ownerUsername,
        req.body.projectName,
        req.body.description,
        req.body.deadline,
      );
      if (repositoryData === undefined) return res.status(401).send({ message: 'Invalid Repository' });

      req.body.repository = repositoryData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
