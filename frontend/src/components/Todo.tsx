import React from "react";

interface Props {
  headers: Headers | undefined;
  todo: ITodo;
}

interface ITodo {
  todoId: number;
  projectName: string;
  ownerUsername: string;
  description: string;
  completedBy: string | undefined;
  timestamp: string | undefined;
}

const completeTodo = async (
    todoId: number,
    ownerUsername: string,
    projectName: string,
    headers: Headers | undefined
): Promise<ITodo[]> => {
  const response = await fetch("/api/todo", {
    method: "PUT",
    headers: headers,
    body: JSON.stringify({ todoId, ownerUsername, projectName }),
  });

  if (response.status !== 200) return [];
  return (await response.json()) as ITodo[];
};

const Todo: React.FC<Props> = (props) => {
  const completeTodoClickedHandler = () => {
    completeTodo(
        props.todo.todoId,
        props.todo.ownerUsername,
        props.todo.projectName,
        props.headers
    ).then((new_todos) => {
      if (new_todos === undefined) return;
    });
  };
  
  return (
    <li>
      <div>
        [{props.todo.completedBy} @ {props.todo.timestamp}]:{" "}
        {props.todo.description}
        <button onClick={completeTodoClickedHandler}>Complete</button>
      </div>
    </li>
  );
};

export default Todo;
