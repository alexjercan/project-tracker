import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IUserInput } from "./types";

import TextInput from "../../utils/TextInput";

import Handler from "./handler";
import Service from "./service";
import Request from "./request";

interface Props {
  setHeadersValue: React.Dispatch<React.SetStateAction<Headers | undefined>>;
}

const Auth: React.FC<Props> = (props) => {
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [userInput, setUserInput] = useState<IUserInput>({
    username: "",
    password: "",
  });

  const history = useHistory<any>();
  const location = useLocation<any>();

  useEffect(() => {
    setUserInput({ username: usernameValue, password: passwordValue });
  }, [usernameValue, passwordValue]);

  const authenticationSuccessfulHandler = () => {
    const { from } = location.state || { from: { pathname: "/" } };
    history.replace(from);
  };

  const request = new Request();
  const service = new Service(request);
  const handler = new Handler(
    service,
    props.setHeadersValue,
    authenticationSuccessfulHandler
  );

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
        <button onClick={() => handler.SignInClickedHandler(userInput)}>
          SignIn
        </button>
        <button onClick={() => handler.SignUpClickedHandler(userInput)}>
          SignUp
        </button>
      </div>
    </div>
  );
};

export default Auth;
