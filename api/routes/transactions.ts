import express, { Request, Response } from "express";
import Joi, { Schema } from "joi";
import { deposit, withdrawal } from "../handlers/transactionHandler";

const router = express.Router();

const withdrawSchema: Schema = Joi.object({
  amount: Joi.number()
    .min(0)
    .max(Number(process.env.WITHDRAW_MAX_TRANSACTION))
    .multiple(Number(process.env.WITHDRAW_DIVISIBLE))
    .required()
    .messages({
      'number.min': `Cannot withdraw a value less than \${#limit}.`,
      'number.max': `Cannot withdraw more than \${#limit} in a single transaction.`,
      'number.multiple': `Can only withdraw an amount that can be dispensed in \${#multiple} bills.`,
    })
});

router.put("/:accountID/withdraw", async (request: Request, response: Response) => {
  const {error} = withdrawSchema.validate(request.body);

  if (error) {
    return response.status(400).send({ error: error.details[0].message });
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

const depositSchema: Schema = Joi.object({
  amount: Joi.number()
    .min(0)
    .max(Number(process.env.DEPOSIT_MAX_TRANSACTION))
    .required()
    .messages({
      'number.min': `Cannot deposit a value less than \${#limit}.`,
      'number.max': `Cannot deposit more than \${#limit} in a single transaction.`,
    })
});

router.put("/:accountID/deposit", async (request: Request, response: Response) => {
  const {error} = depositSchema.validate(request.body);

  if (error) {
    return response.status(400).send({ error: error.details[0].message });
  }

  try {
    const updatedAccount = await deposit(request.params.accountID, request.body.amount);
    return response.status(200).send(updatedAccount);
  } catch (err) {
    if(err instanceof Error) {
      return response.status(400).send({"error": err.message});
    }
  }
});

export default router;
