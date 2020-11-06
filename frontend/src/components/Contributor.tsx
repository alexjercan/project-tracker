import React from "react";

interface Props {
  headers: Headers | undefined;
  contributor: IContributor;
}

interface IContributor {
  projectName: string;
  ownerUsername: string;
  contributorUsername: string;
}

const Contributor: React.FC<Props> = (props) => {
  return <li>{props.contributor.contributorUsername}</li>;
};

export default Contributor;
