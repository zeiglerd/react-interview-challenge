import { query } from "../utils/db";
import { getAccount } from "./accountHandler";

export const withdrawal = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);
  
  if (amount > Number(process.env.WITHDRAW_MAX_TRANSACTION)) {
    throw new Error(`Can withdraw no more than $${process.env.WITHDRAW_MAX_TRANSACTION} in a single transaction.`);
  }
  // if (amount > process.env.WITHDRAW_MAX_DAILY) { // @TODO
  //   throw new Error(`Can withdraw no more than $${process.env.WITHDRAW_MAX_DAILY} in a single day.`);
  // }
  if (amount % Number(process.env.WITHDRAW_DIVISIBLE) !== 0) {
    throw new Error(`Can only withdraw an amount that can be dispensed in $${process.env.WITHDRAW_DIVISIBLE} bills.`);
  }
  if (account.type === 'credit') {
    let availableCredit = account.creditLimit;
    availableCredit += account.amount;
    if (amount > availableCredit) {
      throw new Error('Cannot withdraw more than your credit limit.');
    }
  } else if (amount > account.amount) {
    throw new Error('Cannot withdraw more than you have in your account.');
  }

  account.amount -= amount;
  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
}

export const deposit = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);

  if (amount > Number(process.env.DEPOSIT_MAX_TRANSACTION)) {
    throw new Error(`Cannot deposit more than $${process.env.DEPOSIT_MAX_TRANSACTION} in a single transaction.`);
  }
  if (account.type === 'credit') {
    const newAmount = amount + account.amount;
    if (newAmount > 0) {
      throw new Error('Cannot deposit more in your account than is needed to reach a zero balance.');
    }
  }

  account.amount += amount;
  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
}
