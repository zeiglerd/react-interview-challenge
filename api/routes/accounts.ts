import express, { Request, Response } from "express";
import Joi, { Schema } from "joi";
import pg from "pg";

import { query } from "../utils/db";

const router = express.Router();

const getAccount: Schema = Joi.string().required();

router.get("/:accountID", async (request: Request, response: Response) => {
  const {error} = getAccount.validate(request.params.accountID);
  
  if (error) {
    return response.status(400).send(error.details[0].message);
  }
  const res = await query(`
    SELECT account_number, name, amount, type, credit_limit 
    FROM accounts 
    WHERE account_number = $1`,
    [request.params.accountID]
  );

  if (res.rowCount === 0) {
    return response.status(404).send({"error": "Account not found"});
  }

  response.send(res.rows[0]);
});

export default router;

