import React from "react";

interface Props {
  headers: Headers | undefined;
  project: IProject | undefined;
}

interface IProject {
  projectName: string;
  ownerUsername: string;
}

const Project: React.FC<Props> = (props) => {
  return <div>{props.project?.ownerUsername}/{props.project?.projectName}</div>;
};

export default Project;