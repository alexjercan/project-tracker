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
  ownerUsername: string,
  projectName: string,
  headers: Headers | undefined
): Promise<IComment[]> => {
  const query = querystring.stringify({ ownerUsername, projectName });
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
): Promise<IComment[] | undefined> => {
  const response = await fetch("/api/comment", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ ownerUsername, projectName, description }),
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as IComment[];
};

const CommentList: React.FC<Props> = (props) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentDescription, setCommentDescription] = useState<string>("");

  useEffect(() => {
    getComments(
        props.ownerUsername,
        props.projectName,
        props.headers
    ).then((response) => setComments(response));
  }, [props.projectName, props.ownerUsername, props.headers]);
  
  useEffect(() => {    
    const interval = setInterval(() => {
      getComments(
        props.ownerUsername,
        props.projectName,
        props.headers
      ).then((response) => setComments(response));
    }, 1000);
    
    return () => {
      clearInterval(interval);
    };
  });

  const addCommentClickedHandler = () => {
    addComment(
      props.ownerUsername,
      props.projectName,
      commentDescription,
      props.headers
    ).then((new_comments) => {
      if (new_comments === undefined) return;
      setComments([...new_comments, ...comments]);
      setCommentDescription("");
    });
  };

  return (
    <div>
      <h3>Comments</h3>
      <div>
        <TextInput
          setTextValue={setCommentDescription}
          defaultValue={commentDescription}
        />
        <button onClick={addCommentClickedHandler}>Add Comment</button>
      </div>
      <ul>
        {comments?.map((comment, index) => (
          <Comment key={index} headers={props.headers} comment={comment} />
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
