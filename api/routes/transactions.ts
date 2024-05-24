import express, { Request, Response } from "express";
import Joi, { Schema } from "joi";
import { withdrawal } from "../handlers/transactionHandler";

const router = express.Router();

const transactionSchema: Schema = Joi.object({
  amount: Joi.number().required(),
});

router.put("/:accountID/withdraw", async (request: Request, response: Response) => {
  const {error} = transactionSchema.validate(request.body);
  console.log(request.body);

  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  try {
    const updatedAccount = await withdrawal(request.params.accountID, request.body.amount);
    return response.status(200).send(updatedAccount);
  } catch (err) {
    if(err instanceof Error) {
      return response.status(400).send({"error": err.message});
    }
  }
});

router.put("/:accountID/deposit", (request: Request, response: Response) => {
  response.send("Transactions deposit route");
});

export default router;