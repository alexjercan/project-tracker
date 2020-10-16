import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import { dotenv } from '../config';
import { ITokenData, IVerified } from './types';

export const verify = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  // const token = req.headers.cookie?.split('=')[1];
  if (token === undefined) return res.status(500).send('Access Denied');

  try {
    const verified = jwt.verify(token, dotenv.auth.secret);
    req.body.verified = verified as IVerified;
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const sign = (res: Response, user: ITokenData): Response => {
  const token: string = jwt.sign({ username: user.username }, dotenv.auth.secret);
  // return res.cookie('auth-token', token, { expires: new Date(Date.now() + 900000), httpOnly: true });
  return res.header('auth-token', token);
};

export { IVerified } from './types';
