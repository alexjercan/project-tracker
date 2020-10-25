export interface ITokenUser {
  user_id: number;
  username: string;
}

export interface IProjectInput {
  user_id: number;
  project_name: string;
}

export interface IProject {
  project_id: number;
  project_name: string;
}
