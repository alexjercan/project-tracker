import React from "react";

interface Props {
  headers: Headers | undefined;
  comment: IComment;
}

interface IComment {
  projectName: string;
  ownerUsername: string;
  username: string;
  description: string;
  timestamp: string;
}

const Comment: React.FC<Props> = (props) => {
  return (
    <li>
      <div>
        [{props.comment.username} @ {props.comment.timestamp}]:{" "}
        {props.comment.description}
      </div>
    </li>
  );
};

export default Comment;
