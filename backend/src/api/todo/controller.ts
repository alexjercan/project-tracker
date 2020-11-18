import Service from './service';
import { NextFunction, Request, Response } from 'express';
import { IVerified } from '@alexjercan/jwt-wrapper';
import { ITokenUser } from './types';
import url from 'url';
import * as querystring from 'querystring';

export default class Controller {
  constructor(private _service: Service) {}

  async AddTodo(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;

    try {
      const todoData = await this._service.AddTodo(
        req.body.ownerUsername,
        req.body.projectName,
        username,
        req.body.description,
      );
      if (todoData === undefined) return res.status(401).send({ message: 'Invalid Todo' });

      req.body.todos = [todoData];
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async CompleteTodo(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;

    try {
      const todoData = await this._service.CompleteTodo(
        req.body.todoId,
        req.body.ownerUsername,
        req.body.projectName,
        username,
      );
      if (todoData === undefined) return res.status(401).send({ message: 'Invalid Todo' });

      req.body.todos = [todoData];
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async GetTodos(req: Request, res: Response, next: NextFunction) {
    const { user }: IVerified = req.body.verified as IVerified;
    const { username }: ITokenUser = user as ITokenUser;
    const parsedUrl = url.parse(req.url);
    const { ownerUsername, projectName } = querystring.parse(parsedUrl.query ?? '') as {
      ownerUsername: string;
      projectName: string;
    };

    try {
      const todoData = await this._service.GetTodos(ownerUsername, projectName, username);
      if (todoData === undefined) return res.status(401).send({ message: 'Invalid Todo' });

      req.body.todos = todoData;
      next();
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}
