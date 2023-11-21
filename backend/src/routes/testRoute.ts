import { Router } from 'express';

export const testRoutes = Router();

testRoutes.get('/', (_, response) => {
  response.send('Hello World');
});