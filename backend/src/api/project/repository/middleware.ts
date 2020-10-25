import { NextFunction, Request, Response } from 'express';
import { IRepository } from './types';

export const repositorySuccess = (req: Request, res: Response, next: NextFunction) => {
  const repository = req.body.repository as IRepository;

  res.status(200).send(repository);
  next();
};
