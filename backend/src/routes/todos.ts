import { Router } from 'express';

export const todoRoutes = Router();

todoRoutes.get('/todo', (request, response) => {
  response.send('GET TODOS');
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