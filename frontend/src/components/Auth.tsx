import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import TextInput from "./utils/TextInput";

interface IAuthInput {
  username: string;
  password: string;
}

interface IResponse {
  status: number;
  headers: Headers;
}

interface Props {
  setHeaders: React.Dispatch<React.SetStateAction<Headers | undefined>>;
}

const post = async (path: string, body: string): Promise<IResponse> => {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
  });
  
  return { status: response.status, headers: response.headers };
};

const signIn = async (username: string, password: string): Promise<Headers | undefined> => {
  const response = await post("/auth/signin", JSON.stringify({username, password}));

  if (response.status !== 200) return undefined;

  return response.headers;
};

const signUp = async (username: string, password: string): Promise<Headers | undefined> => {
  const response = await post("/auth/signup", JSON.stringify({username, password}));

  if (response.status !== 200) return undefined;

  return response.headers;
};

const Auth: React.FC<Props> = (props) => {
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");

  const history = useHistory<any>();
  const location = useLocation<any>();

  const authenticationSuccessfulHandler = () => {
    const { from } = location.state || { from: { pathname: "/" } };
    history.replace(from);
  };

  const signInClickedHandler = async () => {
    const headers = await signIn(usernameValue, passwordValue);
    props.setHeaders(headers);

    if (headers !== undefined) authenticationSuccessfulHandler();
  };

  const signUpClickedHandler = async () => {
    const headers = await signUp(usernameValue, passwordValue);
    props.setHeaders(headers);

    if (headers !== undefined) authenticationSuccessfulHandler();
  };

  return (
    <div>
      <div>
        <div>username</div>
        <TextInput setTextValue={setUsernameValue} />
      </div>
      <div>
        <div>password</div>
        <TextInput setTextValue={setPasswordValue} fieldType={"password"} />
      </div>
      <div>
        <button onClick={() => signInClickedHandler()}>SignIn</button>
        <button onClick={() => signUpClickedHandler()}>SignUp</button>
      </div>
    </div>
  );
};

export default Auth;
