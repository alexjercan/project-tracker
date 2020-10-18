import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { signIn, signUp } from "./service";
import TextInput from "../../utils/TextInput";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

interface Props {
  setHeadersValue: React.Dispatch<React.SetStateAction<Headers | undefined>>;
}

const Auth: React.FC<Props> = (props) => {
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");

  let history = useHistory<any>();
  let location = useLocation<any>();

  const authenticationSuccessfulHandler = () => {
    const { from } = location.state || { from: { pathname: "/" } };
    history.replace(from);
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
        <SignIn
          userInput={{ username: usernameValue, password: passwordValue }}
          signIn={signIn}
          setHeadersValue={props.setHeadersValue}
          authenticationSuccessfulHandler={authenticationSuccessfulHandler}
        />
        <SignUp
          userInput={{ username: usernameValue, password: passwordValue }}
          signUp={signUp}
          setHeadersValue={props.setHeadersValue}
          authenticationSuccessfulHandler={authenticationSuccessfulHandler}
        />
      </div>
    </div>
  );
};

export default Auth;
