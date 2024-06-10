import { tQuery } from "../utils/db";
import { getAccount } from "./accountHandler";

export const withdrawal = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);
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

    const transactionsValidate = await client.query(`
      SELECT amount,
             date
      FROM transactions
      WHERE account_number = $1
        AND type = 'withdraw'
        AND date >= NOW() - INTERVAL '24 HOUR'
      `,
      [accountID]
    );
    if (!transactionsValidate || !transactionsValidate.rows || !transactionsValidate.rows.length) {
      throw new Error('Unable to validate transaction at this time. Please try again.');
    }

    const withdrawnToday = transactionsValidate.rows.reduce((accumulator: number, previousValue) =>
      previousValue ? accumulator + previousValue.amount : 0, 0);
    if (withdrawnToday > Number(process.env.WITHDRAW_MAX_DAILY)) {
      throw new Error(`Can withdraw no more than $${process.env.WITHDRAW_MAX_DAILY} in a single day. You have withdrawn $${withdrawnToday - amount}.`);
    }
    account.withdrawnTodayTotal = withdrawnToday;

    const accountsValidate = await client.query(`
      SELECT amount,
             credit_limit,
             type
      FROM accounts
      WHERE account_number = $1
      `,
      [accountID]
    );
    if (!accountsValidate || !accountsValidate.rows || !accountsValidate.rows.length) {
      throw new Error('Unable to validate account at this time. Please try again.');
    }

    const accountsRow = accountsValidate.rows[0];
    if (accountsRow.type === 'credit') {
      if ((accountsRow.credit_limit + accountsRow.amount) < 0) {
        throw new Error(`Cannot withdraw more than your credit limit. Your credit limit is $${accountsRow.credit_limit}.`);
      }
    } else if (accountsRow.amount < 0) {
      throw new Error('Cannot withdraw more than you have in your account.');
    }
  });
  return account;
}

export const deposit = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);
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

    const accountsValidate = await client.query(`
      SELECT amount,
             type
      FROM accounts
      WHERE account_number = $1
      `,
      [accountID]
    );
    if (!accountsValidate || !accountsValidate.rows || !accountsValidate.rows.length) {
      throw new Error('Unable to validate account at this time. Please try again.');
    }

    const accountsRow = accountsValidate.rows[0];
    if (accountsRow.type === 'credit' && accountsRow.amount > 0) {
      throw new Error('Cannot deposit more in your account than is needed to reach a zero balance.');
    }
  });
  return account;
}
