import { Request, Response, NextFunction } from "express";
import { Schema } from 'joi';

const validationMiddleware = (schema: Schema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const { error } = schema.validate(request.body);

    if (error) {
      // Handle validation error
      console.log(error.message);
      response.status(400).json({ errors: error.details });
    } else {
      // Data is valid, proceed to the next middleware
      next();
    }
  };
};

export default validationMiddleware;