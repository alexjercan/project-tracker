import Controller from './controller';
import { Router } from 'express';
import Model from './model';
import Service from './service';

const auth = () => {
  const model = new Model();
  const service = new Service(model);
  const controller = new Controller(service);

  const router = Router();

  router.post('/signup', controller.SignUp.bind(controller));
  router.post('/signin', controller.SignIn.bind(controller));

  return router;
};

export default auth;
