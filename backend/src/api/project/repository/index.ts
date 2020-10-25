import { Router } from 'express';
import Model from './model';
import Service from './service';
import Controller from './controller';
import {repositorySuccess} from "./middleware";

const repository = () => {
  const model = new Model();
  const service = new Service(model);
  const controller = new Controller(service);

  const router = Router();

  router.get('/', controller.GetRepository.bind(controller), repositorySuccess);
  router.post('/', controller.EditRepository.bind(controller), repositorySuccess);

  return router;
};

export default repository;
