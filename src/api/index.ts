import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import { dotenv } from '../config';

const verifyTokenScuffed = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  if (token === undefined) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, dotenv.auth.secret);
    if (verified === undefined) return res.status(401).send('Invalid Token');
    next();
  } catch (error) {
    res.status(400).send(error);
  }
};

const api = () => {
  const router = Router();

  router.use(verifyTokenScuffed);

  router.get('/', (req: Request, res: Response, next: NextFunction) => res.status(200).send('peepeepoopoo'));

  return router;
};

export default api;
