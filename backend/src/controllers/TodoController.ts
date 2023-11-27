import { Client } from "pg";
import { Todo } from "../models/Todo";

export class TodoController {

  client: Client;

  constructor() {
    this.client = new Client();
    this.client.connect();
  }

  async getAllTodos() {
    const response = await this.client.query('SELECT * FROM todo');
    console.log(response);
    return response;
  }
}