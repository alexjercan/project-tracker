import { Request, Response, NextFunction, Router } from 'express';
import { IVerified, verify } from '../token';
import { dotenv } from '../config';

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header(dotenv.auth.token);

  const verified = verify(token, dotenv.auth.secret);
  if (verified === undefined) return res.status(500).send('Access Denied');

  req.body.verified = verified as IVerified;
  next();
};
