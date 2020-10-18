import { IResponse } from "./types";

export default class Request {
  async Post(path: string, body: string): Promise<IResponse> {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    });

    return { status: response.status, headers: response.headers };
  }
}
