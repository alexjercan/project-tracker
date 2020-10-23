export interface ITokenUser {
  user_id: number;
  username: string;
}

export interface IProjectInput {
  user_id: number;
  project_name: string;
}

export interface IProject {
  owner_id: number;
  project_id: number;
  project_name: string;
}