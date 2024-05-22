import express, { Request, Response } from "express";
import Joi, { Schema } from "joi";
import pg from "pg";

const router = express.Router();

router.get("/", (request: Request, response: Response) => {
  response.send("Accounts get route");
});

const getAccount: Schema = Joi.string().required();

router.get("/:accountID", async (request: Request, response: Response) => {
  const {error} = getAccount.validate(request.params.accountID);
  
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  console.log(process.env.DATABASE_URL);

  const {Client} = pg;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();

  const res = await client.query(`SELECT account_number, name, amount, type, credit_limit 
    FROM accounts 
    WHERE account_number = $1`, 
    [request.params.accountID]);

  await client.end();
  response.send(res.rows[0]);
});

export default router;

