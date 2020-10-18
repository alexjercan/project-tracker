import React from "react";
import { IUserInput } from "./types";

interface Props {
  userInput: IUserInput;
  signIn: (userInput: IUserInput) => Promise<Headers | undefined>;
  setHeadersValue: React.Dispatch<React.SetStateAction<Headers | undefined>>;
  authenticationSuccessfulHandler: () => void;
}

const SignIn: React.FC<Props> = (props) => {
  const signInClickedHandler = async () => {
    const headers = await props.signIn(props.userInput);
    props.setHeadersValue(headers);

    if (headers !== undefined) props.authenticationSuccessfulHandler();
  };

  return <button onClick={signInClickedHandler}>SignIn</button>;
};

export default SignIn;
