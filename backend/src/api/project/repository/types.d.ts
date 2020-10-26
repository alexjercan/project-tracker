export interface ITokenUser {
  user_id: number;
  username: string;
}

export interface IRepositoryKey {
  user_id: number;
  project_name: string;
}

export interface IRepositoryInput {
  description: string;
  deadline: string;
}

export interface IRepository {
  description: string;
  started: string;
  deadline: string;
  last_modified: string;
}
