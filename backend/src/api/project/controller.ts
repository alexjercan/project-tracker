import { IVerified } from '@alexjercan/jwt-wrapper';
import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { ITokenUser } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  async CreateProject(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;

    try {
      const projectData = await this._service.CreateProject(username, req.body.projectName);
      if (projectData === undefined) return res.status(401).send({ message: 'Invalid Project' });

      req.body.projects = [projectData];
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async GetProjects(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;

    try {
      const projectsData = await this._service.GetProjects(username);
      if (projectsData === undefined) return res.status(401).send({ message: 'Invalid Project' });

      req.body.projects = projectsData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async DeleteProject(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;

    try {
      const projectData = await this._service.DeleteProject(username, req.body.projectName);
      if (projectData === undefined) return res.status(401).send({ message: 'Invalid Project' });

      req.body.projects = [projectData];
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
