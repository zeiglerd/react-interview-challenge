import express from 'express';
import { testRoutes } from './testRoute';
import { todoRoutes } from './todos';

export const routes = express.Router();

routes.use(testRoutes);
routes.use(todoRoutes);