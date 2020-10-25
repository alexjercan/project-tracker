export interface ITokenUser {
  user_id: number;
  username: string;
}

export interface IProfileInput {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface IProfile {
  first_name: string;
  last_name: string;
  email: string;
}
