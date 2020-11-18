import React, { useEffect, useState } from "react";
import TextInput from "./utils/TextInput";
import querystring from "querystring";
import Todo from "./Todo";

interface Props {
  headers: Headers | undefined;
  ownerUsername: string;
  projectName: string;
}

interface ITodo {
  todoId: number;
  projectName: string;
  ownerUsername: string;
  description: string;
  completedBy: string | undefined;
  timestamp: string | undefined;
}

const getTodos = async (
  ownerUsername: string,
  projectName: string,
  headers: Headers | undefined
): Promise<ITodo[]> => {
  const query = querystring.stringify({ ownerUsername, projectName });
  const url = "/api/todo?" + query;
  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (response.status !== 200) return [];
  return (await response.json()) as ITodo[];
};

const addTodo = async (
  ownerUsername: string,
  projectName: string,
  description: string,
  headers: Headers | undefined
): Promise<ITodo[] | undefined> => {
  const response = await fetch("/api/todo", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ ownerUsername, projectName, description }),
  });

  if (response.status !== 200) return undefined;
  return (await response.json()) as ITodo[];
};

const TodoList: React.FC<Props> = (props) => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [todoDescription, setTodoDescription] = useState<string>("");

  useEffect(() => {
    getTodos(
        props.ownerUsername,
        props.projectName,
        props.headers
    ).then((response) => setTodos(response));
  }, [props.projectName, props.ownerUsername, props.headers]);
  
  useEffect(() => {    
    const interval = setInterval(() => {
      getTodos(
        props.ownerUsername,
        props.projectName,
        props.headers
      ).then((response) => setTodos(response));
    }, 1000);
    
    return () => {
      clearInterval(interval);
    };
  });

  const addTodoClickedHandler = () => {
    addTodo(
      props.ownerUsername,
      props.projectName,
      todoDescription,
      props.headers
    ).then((new_todos) => {
      setTodoDescription("");
      if (new_todos === undefined) return;
      setTodos([...new_todos, ...todos]);
    });
  };

  return (
    <div>
      <h3>Todos</h3>
      <div>
        <TextInput
          setTextValue={setTodoDescription}
          defaultValue={todoDescription}
        />
        <button onClick={addTodoClickedHandler}>Add Todo</button>
      </div>
      <ul>
        {todos?.map((todo, index) => (
          <Todo key={index} headers={props.headers} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
