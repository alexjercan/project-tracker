import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as querystring from "querystring";
import TextInput from "./utils/TextInput";

const { URLSearchParams } = require("url");

interface Props {
  headers: Headers | undefined;
}

interface IProject {
  projectName: string;
  ownerUsername: string;
}

interface IRepository {
  ownerUsername: string;
  projectName: string;
  description: string;
  deadline: string;
  started: string;
  lastModified: string;
}

const getRepository = async (
  project: IProject,
  headers: Headers | undefined
): Promise<IRepository | undefined> => {
  const query = querystring.stringify(project as {});
  const url = "/api/repository?" + query;
console.log(url);
  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IRepository;
};

const Repository: React.FC<Props> = (props) => {
  const [repository, setRepository] = useState<IRepository | undefined>();
  const { ownerUsername, projectName } = useParams<IProject>();

  useEffect(() => {
    getRepository(
      { ownerUsername, projectName },
      props.headers
    ).then((response) => setRepository(response));
  }, [props.headers]);

  return (
      <div>
        <h2>Repository {repository?.projectName}</h2>
        <div>Owner {repository?.ownerUsername}</div>
        <div>Description</div>
        <TextInput setTextValue={() => {}} defaultValue={repository?.description} />
        <div>Deadline</div>
        <TextInput setTextValue={() => {}} defaultValue={repository?.deadline} />
        <div>Started {repository?.started}</div>
        <div>Last Modified {repository?.lastModified}</div>
        <button onClick={() => {}}>
          Edit Repository
        </button>
      </div>
  );
};

export default Repository;
