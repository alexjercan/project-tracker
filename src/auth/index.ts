import { signUp, signIn, logOut } from './controller';
import { NextFunction, Request, Response, Router } from 'express';

const ensureNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return res.status(200).send('Authenticated');
  next();
};

const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) return res.status(200).send('Not Authenticated');
  next();
};

const auth = () => {
  const router = Router();

  router.post('/signup', ensureNotAuthenticated, signUp);
  router.post('/signin', ensureNotAuthenticated, signIn);
  router.post('/logout', ensureAuthenticated, logOut);

  return router;
};

export default auth;
