import React from "react";
import { Link } from "react-router-dom";

interface Props {
  headers: Headers | undefined;
  project: IProject;
}

interface IProject {
  projectName: string;
  ownerUsername: string;
}

const Project: React.FC<Props> = (props) => {
  return (
    <Link to={{pathname: `/${props.project?.ownerUsername}/${props.project?.projectName}`}} >
      {props.project?.ownerUsername}/{props.project?.projectName}
    </Link>
  );
};

export default Project;