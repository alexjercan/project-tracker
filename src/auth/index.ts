import Controller from './controller';
import { NextFunction, Request, Response, Router } from 'express';
import Model from './model';
import Service from './service';

const ensureNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // if (req.isAuthenticated()) return res.status(200).send('Authenticated');
  next();
};

const auth = () => {
  const model = new Model();
  const service = new Service(model);
  const controller = new Controller(service);

  const router = Router();

  router.post('/signup', ensureNotAuthenticated, controller.SignUp.bind(controller));
  router.post('/signin', ensureNotAuthenticated, controller.SignIn.bind(controller));

  return router;
};

export default auth;
