import Service from './service';
import { NextFunction, Request, Response } from 'express';
import { IVerified } from '@alexjercan/jwt-wrapper';
import { ICommentInput, ICommentKey, ITokenUser } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  async AddComment(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;
    const { owner_username, project_name }: ICommentKey = req.body as ICommentKey;
    const { description }: ICommentInput = req.body as ICommentInput;

    try {
      const commentData = await this._service.AddComment({ owner_username, project_name, username }, { description });
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
    const { owner_username, project_name }: ICommentKey = req.body as ICommentKey;

    try {
      const commentsData = await this._service.GetComments(owner_username, project_name, username);
      if (commentsData === undefined) return res.status(401).send({ message: 'Invalid Comment' });

      req.body.comments = commentsData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
