export interface ITokenUser {
  user_id: number;
  username: string;
}

export interface IProfileKey {
  user_id: number;
}

export interface IProfileInput {
  first_name: string;
  last_name: string;
  email: string;
}

export interface IProfile {
  first_name: string;
  last_name: string;
  email: string;
}
