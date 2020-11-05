import React from "react";

interface Props {
  headers: Headers | undefined;
  project: IProject | undefined;
}

interface IProject {
  project_name: string;
  owner_username: string;
}

const Project: React.FC<Props> = (props) => {
  return <div>{props.project?.owner_username}/{props.project?.project_name}</div>;
};

export default Project;