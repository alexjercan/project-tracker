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
  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IRepository;
};

const postRepository = async (
  ownerUsername: string,
  projectName: string,
  description: string,
  deadline: string,
  headers: Headers | undefined
): Promise<IRepository | undefined> => {
  const response = await fetch("/api/repository", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ ownerUsername, projectName, description, deadline }),
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IRepository;
};

const Repository: React.FC<Props> = (props) => {
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [started, setStarted] = useState<string>("");
  const [lastModified, setLastModified] = useState<string>("");
  const { ownerUsername, projectName } = useParams<IProject>();

  useEffect(() => {
    getRepository({ ownerUsername, projectName }, props.headers).then(
      (response) => {
        if (response === undefined) return undefined;
        setDescription(response.description);
        setDeadline(response.deadline);
        setStarted(response.started);
        setLastModified(response.lastModified);
      }
    );
  }, [props.headers]);

  const editRepositoryClickedHandler = async () => {
    const repository = await postRepository(
      ownerUsername,
      projectName,
      description,
      deadline,
      props.headers
    );

    if (repository === undefined) return;

    setDescription(repository.description);
    setDeadline(repository.deadline);
    setStarted(repository.started);
    setLastModified(repository.lastModified);
  };

  return (
    <div>
      <h2>Repository {projectName}</h2>
      <div>Owner {ownerUsername}</div>
      <div>Description</div>
      <TextInput setTextValue={setDescription} defaultValue={description} />
      <div>Deadline</div>
      <TextInput setTextValue={setDeadline} defaultValue={deadline} />
      <div>Started {started}</div>
      <div>Last Modified {lastModified}</div>
      <button onClick={() => editRepositoryClickedHandler()}>
        Edit Repository
      </button>
    </div>
  );
};

export default Repository;
