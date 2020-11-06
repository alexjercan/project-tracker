import Service from './service';
import { NextFunction, Request, Response } from 'express';
import { IVerified } from '@alexjercan/jwt-wrapper';
import { ITokenUser } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  async AddComment(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;

    try {
      const commentData = await this._service.AddComment(req.body.ownerUsername, req.body.projectName, username, req.body.description);
      if (commentData === undefined) return res.status(401).send({ message: 'Invalid Comment' });

      req.body.comments = [commentData];
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async GetComments(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;

    try {
      const commentsData = await this._service.GetComments(req.body.ownerUsername, req.body.projectName, username);
      if (commentsData === undefined) return res.status(401).send({ message: 'Invalid Comment' });

      req.body.comments = commentsData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
