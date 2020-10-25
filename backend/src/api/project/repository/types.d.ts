export interface ITokenUser {
  user_id: number;
  username: string;
}

export interface IRepositoryInput {
  user_id: number;
  project_name: string;
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
