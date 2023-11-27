import { Router } from 'express';
import { TodoController } from '../controllers/TodoController';
import { Todo } from '../models/Todo';
import { todo } from 'node:test';

export const todoRoutes = Router();

todoRoutes.get('/todo', async (_, response, next) => {
  try {
    const controller = new TodoController();
    const todos: Todo[] = await controller.getAllTodos();
    response.send(todos);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

todoRoutes.get('/todo/:id', async (request, response) => {
  try {
    const id: number = parseInt(request.params.id);
    const controller = new TodoController();
    const todo: Todo = await controller.getTodoByID(id);
    response.send(todo);
  } catch (e) {
    console.error(e);
  }
});

todoRoutes.post('/todo', async (request, response) => {
  const todoRequest: Todo = request.body;
  const controller = new TodoController();
  const createdCount: number = await controller.createTodo(todoRequest);
  if (createdCount > 0) {
    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
});

todoRoutes.put('/todo/:id', async (request, response) => {
  const todoRequest: Todo = request.body;
  todoRequest.id = parseInt(request.params.id);
  const controller = new TodoController();
  const updatedCount: number = await controller.updateTodo(todoRequest);
  if (updatedCount === 1) {
    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
});

todoRoutes.patch('/todo/:id/complete', async (request, response) => {
  const todoID: number = parseInt(request.params.id);
  const controller = new TodoController();
  const updatedCount: number = await controller.markTodoComplete(todoID);
  if (updatedCount === 1) {
    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
});

todoRoutes.patch('/todo/:id/incomplete', async (request, response) => {
  const todoID: number = parseInt(request.params.id);
  const controller = new TodoController();
  const updatedCount: number = await controller.markTodoIncomplete(todoID);
  if (updatedCount === 1) {
    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
});

todoRoutes.delete('/todo/:id', async (request, response) => {
  const todoID: number = parseInt(request.params.id);
  const controller = new TodoController();
  const deletedCount = await controller.deleteTodo(todoID);
  if(deletedCount === 1) {
    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
});