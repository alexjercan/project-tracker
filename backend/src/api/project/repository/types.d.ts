export interface ITokenUser {
  user_id: number;
  username: string;
}

export interface IProjectInput {
  user_id: number;
  project_name: string;
}

export interface IRepositoryInput {
  user_id: number;
  project_name: string;
  description: string;
  deadline: string;
}

export interface IRepository {
  project_name: string;
  description: string;
  started: string;
  deadline: string;
  last_modified: string;
}
