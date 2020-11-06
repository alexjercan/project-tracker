import React, { useEffect, useState } from "react";
import TextInput from "./utils/TextInput";
import Comment from "./Comment";
import querystring from "querystring";

interface Props {
  headers: Headers | undefined;
  ownerUsername: string;
  projectName: string;
}

interface IComment {
  projectName: string;
  ownerUsername: string;
  username: string;
  description: string;
  timestamp: string;
}

const getComments = async (
  projectName: string,
  ownerUsername: string,
  headers: Headers | undefined
): Promise<IComment[]> => {
  const query = querystring.stringify({ projectName, ownerUsername });
  const url = "/api/comment?" + query;
  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (response.status !== 200) return [];
  return (await response.json()) as IComment[];
};

const addComment = async (
  ownerUsername: string,
  projectName: string,
  description: string,
  headers: Headers | undefined
): Promise<IComment | undefined> => {
  const response = await fetch("/api/comment", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ ownerUsername, projectName, description }),
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IComment;
};

const CommentList: React.FC<Props> = (props) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentDescription, setCommentDescription] = useState<string>("");

  useEffect(() => {
    getComments(
      props.projectName,
      props.ownerUsername,
      props.headers
    ).then((response) => setComments(response));
  }, [props.headers]);

  const addProjectClickedHandler = async () => {
    const project = await addComment(
      props.projectName,
      props.ownerUsername,
      commentDescription,
      props.headers
    );
    if (project === undefined) return;
    setComments([...comments, project]);
  };

  return (
    <div>
      <h3>Projects</h3>
      <div>
        Project Name
        <TextInput setTextValue={setCommentDescription} />
        <button onClick={addProjectClickedHandler}>Add Project</button>
      </div>
      <ul>
        {comments?.map((comment) => (
          <Comment
            key={comment.username + "/" + comment.timestamp}
            headers={props.headers}
            comment={comment}
          />
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
