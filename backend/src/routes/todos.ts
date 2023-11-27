import { Router } from 'express';
import { TodoController } from '../controllers/TodoController';
import { Todo } from '../models/Todo';

export const todoRoutes = Router();

todoRoutes.get('/todo', async (request, response, next) => {
  try {
    const controller = new TodoController();
    const todos = await controller.getAllTodos();
    response.send(todos);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

todoRoutes.post('/todo', (request, response) => {
    response.send('POST TODOS');
});

todoRoutes.put('/todo/:id', (request, response) => {
  response.send('PUT TODOS');
});

todoRoutes.patch('/todo/:id', (request, response) => {
  response.send('PATCH TODOS');
});

todoRoutes.delete('/todo/:id', (request, response) => {
  response.send('DELETE TODOS');
});