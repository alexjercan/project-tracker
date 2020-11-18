import Model from './model';
import { ITodo } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async AddTodo(
    ownerUsername: string,
    projectName: string,
    username: string,
    description: string,
  ): Promise<ITodo | undefined> {
    try {
      return await this._model.Create(ownerUsername, projectName, username, description);
    } catch (error) {
      throw error;
    }
  }

  async CompleteTodo(
    todoId: number,
    ownerUsername: string,
    projectName: string,
    username: string,
  ): Promise<ITodo | undefined> {
    try {
      return await this._model.Complete(todoId, ownerUsername, projectName, username);
    } catch (error) {
      throw error;
    }
  }

  async GetTodos(ownerUsername: string, projectName: string, username: string): Promise<ITodo[] | undefined> {
    try {
      return await this._model.FindAll(ownerUsername, projectName, username);
    } catch (error) {
      throw error;
    }
  }
}
