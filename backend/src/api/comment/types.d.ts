export interface ITokenUser {
  username: string;
}

export interface ICommentKey {
  project_name: string;
  owner_username: string;
  username: string;
}

export interface ICommentInput {
  description: string;
}

export interface IComment {
  project_name: string;
  owner_username: string;
  username: string;
  description: string;
  timestamp: string;
}
