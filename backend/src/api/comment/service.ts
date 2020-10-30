import Model from './model';
import { IComment, ICommentKey, ICommentInput } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async AddComment(commentKey: ICommentKey, commentInput: ICommentInput): Promise<IComment | undefined> {
    try {
      return await this._model.Create(commentKey, commentInput);
    } catch (error) {
      throw error;
    }
  }

  async GetComments(owner_username: string, project_name: string, username: string): Promise<IComment[] | undefined> {
    try {
      return await this._model.FindAll(owner_username, project_name);
    } catch (error) {
      throw error;
    }
  }
}
