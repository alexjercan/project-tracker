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

  async GetComments(ownerUsername: string, projectName: string, username: string): Promise<IComment[] | undefined> {
    try {
      return await this._model.FindAll(ownerUsername, projectName, username);
    } catch (error) {
      throw error;
    }
  }
}
