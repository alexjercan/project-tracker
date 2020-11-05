import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface IProject {
  project_name: string;
  owner_username: string;
}

export interface IUserInput {
  project_name: string;
}

interface Props {
  headers: Headers | undefined;
  setHeaders: React.Dispatch<React.SetStateAction<Headers | undefined>>;
}

const getProjects = async (
  headers: Headers | undefined
): Promise<IProject[] | undefined> => {
  const response = await fetch("/api/project", {
    method: "GET",
    headers: headers,
  });

  if (response.status !== 200) return undefined;
  const a = await response.json();
  console.log(a);
  return a as IProject[];
};

const Dashboard: React.FC<Props> = (props) => {
  const [response, setResponse] = useState<IProject[] | undefined>();

  useEffect(() => {
    getProjects(props.headers).then((response) => setResponse(response));
  }, [props.headers, setResponse]);

  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/profile">Profile</Link>
    </div>
  );
};

export default Dashboard;
