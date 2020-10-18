import React from "react";
import { IUserInput } from "./types";

interface Props {
  userInput: IUserInput;
  signUp: (userInput: IUserInput) => Promise<Headers | undefined>;
  setHeadersValue: React.Dispatch<React.SetStateAction<Headers | undefined>>;
  authenticationSuccessfulHandler: () => void;
}

const SignUp: React.FC<Props> = (props) => {
  const signUpClickedHandler = async () => {
    const headers = await props.signUp(props.userInput);
    props.setHeadersValue(headers);

    if (headers !== undefined) props.authenticationSuccessfulHandler();
  };

  return <button onClick={signUpClickedHandler}>SignUp</button>;
};

export default SignUp;
