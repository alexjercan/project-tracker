import { NextFunction, Request, Response } from 'express';
import { IProject } from './types';

export const projectSuccess = (req: Request, res: Response, next: NextFunction) => {
  const projects = req.body.projects as IProject[];

  const projectNames = projects.map((project) => ({ project_name: project.project_name }));

  res.status(200).send({ projects: projectNames });
  next();
};
