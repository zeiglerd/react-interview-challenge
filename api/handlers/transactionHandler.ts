import { query } from "../utils/db";
import { getAccount } from "./accountHandler";

export const withdrawal = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);
  
  if (amount > 200) {
    throw new Error('Can withdraw no more than $200 in a single transaction.');
  }
  // if (amount > 400) { // @TODO
  //   throw new Error('Can withdraw no more than $400 in a single day.');
  // }
  if (amount % 5 !== 0) {
    throw new Error('Can only withdraw an amount that can be dispensed in $5 bills.');
  }
  if (account.type === 'credit') {
    let availableCredit = account.creditLimit;
    availableCredit += account.amount;
    if (amount > availableCredit) {
      throw new Error('Cannot withdraw more than your credit limit.');
    }
  } else if (amount > account.amount) {
    throw new Error('Cannot withdraw more than you have in you account.');
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

  if (amount > 1000) {
    throw new Error('Cannot deposit more than $1000 in a single transaction.');
  }
  if (account.type === 'credit') {
    const newAmount = amount + account.amount;
    if (newAmount > 0) {
      throw new Error('Cannot deposit more in your account than is needed to reach a $0 balance.');
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
