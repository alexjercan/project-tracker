import Controller from './controller';
import { Router } from 'express';
import { ensureAuthenticated } from './middleware';
import Service from './service';
import project from './project';
import profile from './profile';
import repository from './repository';
import contributor from './contributor';
import comment from './comment';
import todo from './todo';

const api = () => {
  const service = new Service();
  const controller = new Controller(service);

  const router = Router();

  router.use(ensureAuthenticated);

  router.use('/todo', todo());
  router.use('/profile', profile());
  router.use('/project', project());
  router.use('/comment', comment());
  router.use('/repository', repository());
  router.use('/contributor', contributor());

  router.get('/', controller.ShowName.bind(controller));

  return router;
};

export default api;
