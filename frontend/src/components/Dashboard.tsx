import React, { useEffect, useState } from "react";

interface IResponse {
  message: string;
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

const Dashboard: React.FC<Props> = (props) => {
  const [responseValue, setResponseValue] = useState<IResponse | undefined>();

  useEffect(() => {
    helloMessage(props.headers).then((response) => setResponseValue(response));
  }, [props.headers, setResponseValue]);

  return (
    <div>
      <h2>Hello {responseValue?.message}</h2>

      <hr />
    </div>
  );
};

export default Dashboard;
