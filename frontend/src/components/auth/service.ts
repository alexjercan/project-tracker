import { IUserInput } from "./types";

export const signIn = async (
  userInput: IUserInput
): Promise<Headers | undefined> => {
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

export const signUp = async (
  userInput: IUserInput
): Promise<Headers | undefined> => {
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
