import Controller from './controller';
import { Router } from 'express';
import { ensureAuthenticated } from './middleware';
import Service from './service';

const api = () => {
  const service = new Service();
  const controller = new Controller(service);

  const router = Router();

  router.get('/', ensureAuthenticated, controller.ShowName.bind(controller));

  return router;
};

export default api;
