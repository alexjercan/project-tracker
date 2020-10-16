import { NextFunction, Request, Response } from 'express';
import { IUser } from './types';
import { sign } from '../token';
import { dotenv } from '../config';

export const authSuccess = (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user as IUser;
  const token = sign({ username: user.username }, dotenv.auth.secret);

  res.status(200).header(dotenv.auth.token, token).send('Authentication Successful');
  next();
};
