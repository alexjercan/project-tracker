import { Router } from 'express';
import { commentSuccess } from './middleware';
import Model from './model';
import Service from './service';
import Controller from './controller';

const comment = () => {
  const model = new Model();
  const service = new Service(model);
  const controller = new Controller(service);

  const router = Router();

  router.get('/', controller.GetComments.bind(controller), commentSuccess);
  router.post('/', controller.AddComment.bind(controller), commentSuccess);

  return router;
};

export default comment;
