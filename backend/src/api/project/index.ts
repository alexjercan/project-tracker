import { Router } from 'express';
import Model from './model';
import Controller from './controller';
import Service from './service';
import { projectSuccess } from './middleware';


const project = () => {
  const model = new Model();
  const service = new Service(model);
  const controller = new Controller(service);

  const router = Router();
  
  router.post('/', controller.CreateProject.bind(controller), projectSuccess);
  router.get('/', controller.GetProjects.bind(controller), projectSuccess);

  return router;
};

export default project;
