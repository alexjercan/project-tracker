import { NextFunction, Request, Response } from 'express';
import Service from './service';
import { IRepositoryInput } from './types';

export default class Controller {
  constructor(private _service: Service) {}

  async GetRepository(req: Request, res: Response, next: NextFunction) {
    const project_id: number = +req.body.project_id;

    try {
      const repositoryData = await this._service.GetRepository(project_id);
      if (repositoryData === undefined) return res.status(401).send({ message: 'Invalid Repository' });

      req.body.repository = repositoryData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async EditRepository(req: Request, res: Response, next: NextFunction) {
    const project_id: number = +req.body.project_id;
    const description = req.body.description;
    const progress = req.body.progress;
    const deadline = req.body.deadline;
    const repositoryInput: IRepositoryInput = { project_id, description, progress, deadline };

    try {
      const repositoryData = await this._service.EditRepository(repositoryInput);
      if (repositoryData === undefined) return res.status(401).send({ message: 'Invalid Repository' });

      req.body.repository = repositoryData;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  }
}
