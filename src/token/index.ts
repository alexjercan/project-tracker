import jwt from 'jsonwebtoken';
import { ITokenData, IVerified } from './types';

export const verify = (token: string | undefined, secret: string): IVerified | undefined => {
  if (token === undefined) return undefined;

  try {
    const verified = jwt.verify(token, secret);
    return verified as IVerified;
  } catch (error) {
    return undefined;
  }
};

export const sign = (user: ITokenData, secret: string): string => {
  const token: string = jwt.sign({ username: user.username }, secret);
  return token;
};

export { IVerified } from './types';
