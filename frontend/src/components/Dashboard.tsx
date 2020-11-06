import React from "react";
import { Link } from "react-router-dom";
import ProjectList from "./ProjectList";

interface Props {
  headers: Headers | undefined;
}

const Dashboard: React.FC<Props> = (props) => {
  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/profile">Profile</Link>
      <ProjectList headers={props.headers} />
    </div>
  );
};

export default Dashboard;
