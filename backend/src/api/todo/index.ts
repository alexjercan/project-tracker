import { Router } from 'express';
import { todoSuccess } from './middleware';
import Model from './model';
import Service from './service';
import Controller from './controller';

const todo = () => {
  const model = new Model();
  const service = new Service(model);
  const controller = new Controller(service);

  const router = Router();

  router.get('/', controller.GetTodos.bind(controller), todoSuccess);
  router.post('/', controller.AddTodo.bind(controller), todoSuccess);
  router.put('/', controller.CompleteTodo.bind(controller), todoSuccess);

  return router;
};

export default todo;
