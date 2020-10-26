import { NextFunction, Request, Response } from 'express';
import { ITokenUser, IUser } from './types';
import { sign } from '@alexjercan/jwt-wrapper';
import { dotenv } from '../config';

export const authSuccess = (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.body.user as IUser;
  const user: ITokenUser = { username };
  const token = sign({ user }, dotenv.auth.secret);

  res.status(200).header(dotenv.auth.token, token).send('Authentication Successful');
  next();
};
