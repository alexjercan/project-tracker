import { NextFunction, Request, Response } from 'express';
import { IProfile } from './types';

export const profileSuccess = (req: Request, res: Response, next: NextFunction) => {
  const profile = req.body.profile as IProfile;

  res.status(200).send({ profile });
  next();
};
