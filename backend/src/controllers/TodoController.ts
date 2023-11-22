import { Client } from "pg";
import { Todo } from "../models/Todo";

class TodoController {

  client: Client;

  constructor() {
    this.client = new Client();
  }

  getAllTodos(): Todo[] {
    return [
      {
        title: 'Todo 1',
        completed: false,
      },
      {
        title: 'Todo 2',
        completed: false,
      },
      {
        title: 'Todo 3',
        completed: true
      },
    ]
  }
}