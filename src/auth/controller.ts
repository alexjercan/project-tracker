import { NextFunction, Request, Response } from 'express';
import Service from './service';
import Model from './model';

const model = new Model();
const service = new Service(model);

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await service.SignUp(req.body);
    if (userData === undefined) return res.status(200).send('Invalid SignUp');

    res.status(200).json(userData);
    next(userData);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await service.SignIn(req.body);
    if (userData === undefined) return res.status(200).send('Invalid SignIn');

    res.status(200).send(userData);
    next(userData);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export const logOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO service.Logout(req.body);
    return res.status(200).end();
  } catch (error) {
    res.status(500);
    next(error);
  }
};
