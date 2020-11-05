import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Project from "./Project";

interface IProject {
  project_name: string;
  owner_username: string;
}

interface IUserInput {
  project_name: string;
}

interface Props {
  headers: Headers | undefined;
}

const getProjects = async (
  headers: Headers | undefined
): Promise<IProject[] | undefined> => {
  const response = await fetch("/api/project", {
    method: "GET",
    headers: headers,
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IProject[];
};

const Dashboard: React.FC<Props> = (props) => {
  const [projects, setProjects] = useState<IProject[] | undefined>();

  useEffect(() => {
    getProjects(props.headers).then((response) => setProjects(response));
  }, [props.headers]);

  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/profile">Profile</Link>
      {projects?.map((project) => (
        <Project headers={props.headers} project={project} />
      ))}
    </div>
  );
};

export default Dashboard;
