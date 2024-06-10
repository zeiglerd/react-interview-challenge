import { query, tQuery } from "../utils/db";
import { account } from "../Types/Account";
import { getAccount } from "./accountHandler";

export const getWithdrawnTodayTotal = async (account: account) => {
  let withdrawnToday = 0;
  const res = await query(`
    SELECT amount,
           date
    FROM transactions
    WHERE account_number = $1
      AND type = 'withdraw'
      AND date >= NOW() - INTERVAL '24 HOUR'
    `,
    [account.account_number]
  );
  if (res && res.rows && res.rows.length) {
    res.rows.forEach((field) => {
      withdrawnToday += field.amount;
    });
  }
  return withdrawnToday;
};

export const withdrawal = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);

  const withdrawnTodayTotal = await getWithdrawnTodayTotal(account);
  if (withdrawnTodayTotal + amount > Number(process.env.WITHDRAW_MAX_DAILY)) {
    throw new Error(`Can withdraw no more than $${process.env.WITHDRAW_MAX_DAILY} in a single day. You have withdrawn ${withdrawnTodayTotal}.`);
  }
  account.withdrawnTodayTotal = withdrawnTodayTotal + amount;

  if (account.type === 'credit') {
    let availableCredit = account.credit_limit;
    availableCredit += account.amount;
    if (amount > availableCredit) {
      throw new Error(`Cannot withdraw more than your credit limit. Your credit limit is ${account.credit_limit}.`);
    }
  } else if (amount > account.amount) {
    throw new Error('Cannot withdraw more than you have in your account.');
  }

  account.amount -= amount;
  await tQuery(async (client) => {
    await client.query(`
      UPDATE accounts
      SET amount = $1
      WHERE account_number = $2`,
      [account.amount, accountID]
    );

    await client.query(`
      INSERT INTO transactions (
        account_number,
        amount,
        type
      ) VALUES (
        $1, $2, 'withdraw'
      )`,
      [accountID, amount]
    );
  });

  return account;
}

export const deposit = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);

  if (account.type === 'credit') {
    const newAmount = amount + account.amount;
    if (newAmount > 0) {
      throw new Error('Cannot deposit more in your account than is needed to reach a zero balance.');
    }
  }

  account.amount += amount;
  await tQuery(async (client) => {
    await client.query(`
      UPDATE accounts
      SET amount = $1
      WHERE account_number = $2`,
      [account.amount, accountID]
    );

    await client.query(`
      INSERT INTO transactions (
        account_number,
        amount,
        type
      ) VALUES (
        $1, $2, 'deposit'
      )`,
      [accountID, amount]
    );
  });

  return account;
}
