import { Client } from "pg";
import { Todo } from "../models/Todo";

export class TodoController {

  client: Client;

  constructor() {
    this.client = new Client();
    this.client.connect();
  }

  async getAllTodos(): Promise<Todo[]> {
    const response = await this.client.query('SELECT * FROM todo');
    const todos: Todo[] = response.rows;
    return todos;
  }

  async getTodoByID(todoID: number): Promise<Todo> {
    const response = await this.client.query(`SELECT * FROM todo WHERE id = ${todoID}`);
    const todo: Todo = response.rows[0];
    return todo;
  }

  async createTodo(todo: Todo): Promise<number> {
    const response = await this.client.query('INSERT INTO todo (title, description, completed) VALUES ($1, $2, $3)', [todo.title, todo.description, todo.completed]);
    return response.rowCount || 0;
  }

  async updateTodo(todo: Todo): Promise<number> {
    const response = await this.client.query('UPDATE todo SET title = $1, description = $2, completed = $3 WHERE id = $4', [todo.title, todo.description, todo.completed, todo.id]);
    return response.rowCount || 0;
  }

  async markTodoComplete(id: number): Promise<number> {
    const response = await this.client.query(`UPDATE todo SET completed = TRUE WHERE id = ${id}`);
    return response.rowCount || 0;
  }

  async markTodoIncomplete(id: number): Promise<number> {
    const response = await this.client.query(`UPDATE todo SET completed = FALSE WHERE id = ${id}`);
    return response.rowCount || 0;
  }

  async deleteTodo(id: number): Promise<number> {
    const response = await this.client.query(`DELETE FROM todo WHERE id = ${id}`);
    return response.rowCount || 0;
  }
}