import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

interface IUserInput {
  username: string;
  password: string;
}

interface Props {
  setHeadersValue: React.Dispatch<React.SetStateAction<Headers | undefined>>;
}

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

  let history = useHistory<any>();
  let location = useLocation<any>();

  const authenticationSuccessfulHandler = () => {
    const { from } = location.state || { from: { pathname: "/" } };
    history.replace(from);
  };

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
    props.setHeadersValue(headers);

    if (headers !== undefined) authenticationSuccessfulHandler();
  };

  const signUpClickedHandler = async () => {
    const userInput: IUserInput = {
      username: usernameValue,
      password: passwordValue,
    };

    const headers = await signUp(userInput);
    props.setHeadersValue(headers);

    if (headers !== undefined) authenticationSuccessfulHandler();
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
      </div>
    </div>
  );
};

export default Auth;
