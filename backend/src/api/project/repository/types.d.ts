export interface ITokenUser {
  username: string;
}

export interface IRepositoryKey {
  username: string;
  owner_username: string;
  project_name: string;
}

export interface IRepositoryInput {
  description: string;
  deadline: string;
}

export interface IRepository {
  owner_username: string;
  project_name: string;
  description: string;
  deadline: string;
  started: string;
  last_modified: string;
}
