import React, { useState } from "react";
import { IResponse } from "../types";
import { IUserInput } from "./types";

interface Props {}

const test = async (
  headers: Headers | undefined
): Promise<IResponse | undefined> => {
  const response = await fetch("/api", {
    method: "GET",
    headers: headers,
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IResponse;
};

const signIn = async (userInput: IUserInput): Promise<Headers | undefined> => {
  const response = await fetch("/auth/signin", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInput),
  });

  if (response.status !== 200) return undefined;

  return response.headers;
};

const signUp = async (userInput: IUserInput): Promise<Headers | undefined> => {
  const response = await fetch("/auth/signup", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInput),
  });

  if (response.status !== 200) return undefined;

  return response.headers;
};

const Auth: React.FC<Props> = (props) => {
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [headersValue, setHeadersValue] = useState<Headers | undefined>();
  const [testValue, setTestValue] = useState<IResponse | undefined>();

  const usernameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameValue(event.target.value);
  };

  const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  const signInClickedHandler = async () => {
    const userInput: IUserInput = {
      username: usernameValue,
      password: passwordValue,
    };

    const headers = await signIn(userInput);
    setHeadersValue(headers);
  };

  const signUpClickedHandler = async () => {
    const userInput: IUserInput = {
      username: usernameValue,
      password: passwordValue,
    };

    const headers = await signUp(userInput);
    setHeadersValue(headers);
  };

  const testClickedHandler = async () => {
    const response = await test(headersValue);
    setTestValue(response);
  };

  return (
    <div>
      <div>
        <div>username</div>
        <input
          className="input"
          type="text"
          onChange={usernameHandler}
          value={usernameValue}
        />{" "}
      </div>
      <div>
        <div>password</div>
        <input
          className="input"
          type="password"
          onChange={passwordHandler}
          value={passwordValue}
        />{" "}
      </div>
      <div>
        <button onClick={signInClickedHandler}>SignIn</button>
        <button onClick={signUpClickedHandler}>SignUp</button>
        <button onClick={testClickedHandler}>Test</button>
      </div>
      <div>
        <div>{testValue?.message}</div>
      </div>
    </div>
  );
};

export default Auth;
