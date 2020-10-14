import Controller from './controller';
import { Router } from 'express';
import Model from './model';
import Service from './service';

export const router = Router();

const model = new Model();
const service = new Service(model);
const controller = new Controller(service);

router.post('/signup', controller.SignUp);
router.post('/login', controller.SignIn);
router.post('/logout', controller.LogOut);
