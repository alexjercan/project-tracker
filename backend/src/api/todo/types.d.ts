export interface ITokenUser {
  username: string;
}

export interface ITodo {
  todoId: number;
  projectName: string;
  ownerUsername: string;
  description: string;
  completedBy: string | undefined;
  timestamp: string | undefined;
}
