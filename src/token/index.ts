import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import { dotenv } from '../config';
import { ITokenData, IVerified } from './types';

export const verify = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  if (token === undefined) return res.status(500).send('Access Denied');

  try {
    const verified = jwt.verify(token, dotenv.auth.secret);
    // verified {username, iat}
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getUsername = (req: Request): IVerified | undefined => {
  const token = req.header('auth-token');
  if (token === undefined) return undefined;
  const verified = jwt.verify(token, dotenv.auth.secret);
  // tslint:disable-next-line: no-console
  console.log(verified);
};

export const sign = (user: ITokenData): string => jwt.sign({ username: user.username }, dotenv.auth.secret);

export { IVerified } from './types';
