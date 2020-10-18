import { IUserInput } from "./types";
import Request from "./request";

export default class Service {
  constructor(private _request: Request) {}

  async SignIn(userInput: IUserInput): Promise<Headers | undefined> {
    const response = await this._request.Post(
      "/auth/signin",
      JSON.stringify(userInput)
    );

    if (response.status !== 200) return undefined;

    return response.headers;
  }

  async SignUp(userInput: IUserInput): Promise<Headers | undefined> {
    const response = await this._request.Post(
      "/auth/signup",
      JSON.stringify(userInput)
    );

    if (response.status !== 200) return undefined;

    return response.headers;
  }
}
