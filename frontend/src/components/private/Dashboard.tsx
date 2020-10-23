import React, { useEffect, useState } from "react";
import TextInput from "../../utils/TextInput";

interface IResponse {
  username: string;
}

export interface IRequestResponse {
  status: number;
  headers: Headers;
}

export interface IUserInput {
  project_name: string;
}

interface Props {
  headers: Headers | undefined;
}

const helloMessage = async (
  headers: Headers | undefined
): Promise<IResponse | undefined> => {
  const response = await fetch("/api", {
    method: "GET",
    headers: headers,
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IResponse;
};

const createClickedHandler = async (
  headers: Headers | undefined,
  userInput: IUserInput
) => {
  const h = new Headers(headers);
  h.set("Content-Type", "application/json");
  h.append("Accept", "application/json")
  h.forEach((value, key) => console.log(value + " " + key));

  const response = await fetch("/api/project/new", {
    method: "POST",
    headers: h,
    body: JSON.stringify(userInput),
  });
};

const Dashboard: React.FC<Props> = (props) => {
  const [responseValue, setResponseValue] = useState<IResponse | undefined>();
  const [projectNameValue, setProjectNameValue] = useState<string>("");

  useEffect(() => {
    helloMessage(props.headers).then((response) => setResponseValue(response));
  }, [props.headers, setResponseValue]);

  return (
    <div>
      <h2>Hello {responseValue?.username}</h2>

      <hr />

      <div>
        <div>username</div>
        <TextInput setTextValue={setProjectNameValue} />
      </div>
      <button
        onClick={() => createClickedHandler(props.headers, { project_name: projectNameValue })}
      >
        SignIn
      </button>
    </div>
  );
};

export default Dashboard;
