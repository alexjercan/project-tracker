import { NextFunction, Request, Response } from 'express';
import { IComment } from './types';

export const commentSuccess = (req: Request, res: Response, next: NextFunction) => {
  const comments = req.body.comments as IComment[];

  res.status(200).send({ comments });
  next();
};
