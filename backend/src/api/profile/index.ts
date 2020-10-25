import { Router } from 'express';
import Model from './model';
import Controller from './controller';
import Service from './service';
import { profileSuccess } from './middleware';

const profile = () => {
  const model = new Model();
  const service = new Service(model);
  const controller = new Controller(service);

  const router = Router();

  router.get('/', controller.GetProfile.bind(controller), profileSuccess);
  router.post('/', controller.EditProfile.bind(controller), profileSuccess);

  return router;
};

export default profile;
