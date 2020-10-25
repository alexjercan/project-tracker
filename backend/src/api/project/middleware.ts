import { NextFunction, Request, Response } from 'express';
import { IProject } from './types';

export const projectSuccess = (req: Request, res: Response, next: NextFunction) => {
  const projects = req.body.projects as IProject[];

  res.status(200).send({projects});
  next();
};
