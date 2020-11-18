import { NextFunction, Request, Response } from 'express';
import { ITodo } from './types';

export const todoSuccess = (req: Request, res: Response, next: NextFunction) => {
  const todos = req.body.todos as ITodo[];

  res.status(200).send(todos);
  next();
};
