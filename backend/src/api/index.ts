import Controller from './controller';
import { Router } from 'express';
import { ensureAuthenticated } from './middleware';
import Service from './service';
import project from './project';

const api = () => {
  const service = new Service();
  const controller = new Controller(service);

  const router = Router();

  router.use(ensureAuthenticated);

  router.use('/project', project());
  router.get('/', controller.ShowName.bind(controller));

  return router;
};

export default api;
