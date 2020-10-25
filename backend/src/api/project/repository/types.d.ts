export interface IRepositoryInput {
  project_id: number;
  description: string;
  progress: string;
  deadline: string;
}

export interface IRepository {
  description: string;
  progress: string;
  started: string;
  deadline: string;
  last_modified: string;
}
