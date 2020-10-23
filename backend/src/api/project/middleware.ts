import { NextFunction, Request, Response } from 'express';
import { IProject } from './types';

export const projectSuccess = (req: Request, res: Response, next: NextFunction) => {
  const data = req.body.project as IProject;

  res.status(200).send({project_name: data.project_name});
  next();
};
