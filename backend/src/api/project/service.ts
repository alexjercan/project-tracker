import Model from './model';
import { IProject, IProjectInput } from './types';

export default class Service {
  constructor(private _model: Model) {}

  async CreateProject(projectInput: IProjectInput): Promise<IProject | undefined> {
    try {
      const record = await this._model.FindOne(projectInput.project_name);
      if (record !== undefined) return undefined;

      const createdRecord = await this._model.Create(projectInput);
      if (createdRecord === undefined) return undefined;

      return createdRecord;
    } catch (error) {
      throw error;
    }
  }

  async GetProject(projectInput: IProjectInput): Promise<IProject | undefined> {
    try {
      const record = await this._model.FindOne(projectInput.project_name);
      if (record === undefined) return undefined;

      return record;
    } catch (error) {
      throw error;
    }
  }

  async GetProjects(projectInput: IProjectInput): Promise<IProject[] | undefined> {
    try {
      const records = await this._model.FindAll(projectInput.user_id);
      if (records === undefined) return undefined;

      return records;
    } catch (error) {
      throw error;
    }
  }
}
