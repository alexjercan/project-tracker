import { NextFunction, Request, Response } from 'express';
import { IContributor } from './types';

export const contributorSuccess = (req: Request, res: Response, next: NextFunction) => {
  const contributors = req.body.contributors as IContributor[];

  res.status(200).send({ contributors });
  next();
};
