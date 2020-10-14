import { signUp, signIn, logOut } from './controller';
import { NextFunction, Request, Response, Router } from 'express';

const ensureNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  next();
};

const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  next();
};

const createSessionCookie = (req: Request, res: Response, next: NextFunction) => {
  console.log('Should create cookie');
};

const deleteSessionCookie = (req: Request, res: Response, next: NextFunction) => {
  console.log('Should delete cookie');
};

const auth = () => {
  const router = Router();

  router.post('/signup', ensureNotAuthenticated, signUp, createSessionCookie);
  router.post('/signin', ensureNotAuthenticated, signIn, createSessionCookie);
  router.post('/logout', ensureAuthenticated, logOut, deleteSessionCookie);

  return router;
};

export default auth;
