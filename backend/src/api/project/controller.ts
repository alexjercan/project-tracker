import { IVerified } from '@alexjercan/jwt-wrapper';
import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { IProjectInput, ITokenUser } from './types';

interface IUserInput {
  project_name: string;
}

export default class Controller {
  constructor(private _service: Service) {}

  async CreateProject(req: Request, res: Response, next: NextFunction) {
    const verified = req.body.verified as IVerified;
    const user = verified.user as ITokenUser;
    const userInput: IUserInput = req.body;

    const projectInput: IProjectInput = { user_id: user.user_id, project_name: userInput.project_name };

    try {
      const projectData = await this._service.CreateProject(projectInput);
      if (projectData === undefined) return res.status(401).send({ message: 'Invalid Project' });

      req.body.projects = [projectData];
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async GetProject(req: Request, res: Response, next: NextFunction) {
    const verified = req.body.verified as IVerified;
    const user = verified.user as ITokenUser;
    const userInput: IUserInput = req.body;

    const projectInput: IProjectInput = { user_id: user.user_id, project_name: userInput.project_name };

    try {
      const projectData = await this._service.GetProject(projectInput);
      if (projectData === undefined) return res.status(401).send({ message: 'Invalid Project' });

      req.body.projects = [projectData];
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async GetProjects(req: Request, res: Response, next: NextFunction) {
    const verified = req.body.verified as IVerified;
    const user = verified.user as ITokenUser;

    try {
      const projectsData = await this._service.GetProjects(user.user_id);
      if (projectsData === undefined) return res.status(401).send({ message: 'Invalid Project' });

      req.body.projects = projectsData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
