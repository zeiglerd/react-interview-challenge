-- CREATE ACCOUNTS TABLE
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    account_number INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    amount INTEGER NOT NULL,
    type VARCHAR NOT NULL,
    credit_limit INTEGER
);

ALTER TABLE accounts ADD CONSTRAINT verify_type
CHECK (type IN ('checking', 'savings', 'credit'));

-- LOAD DATAS
INSERT INTO accounts
    (account_number, name, amount, type)
VALUES
    (1, 'Johns Checking', 1000, 'checking'),
    (2, 'Janes Savings', 2000, 'savings'),
    (4, 'Bobs Checking', 40000, 'checking'),
    (5, 'Bills Savings', 50000, 'savings'),
    (7, 'Nancy Checking', 70000, 'checking'),
    (8, 'Nancy Savings', 80000, 'savings'),
    (10, 'Steves Checking', 200, 'checking'),
    (11, 'Rudys Savings', 100, 'savings');

INSERT INTO accounts
    (account_number, name, amount, type, credit_limit)
VALUES
    (3, 'Jills Credit', -3000, 'credit', 10000),
    (6, 'Bills Credit', -60000, 'credit', 60000),
    (9, 'Nancy Credit', -90000, 'credit', 100000),
    (12, 'Hanks Credit', -400, 'credit', 1000);

-- CREATE TRANSACTIONS TABLE
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
  transaction_number BIGSERIAL PRIMARY KEY,
  account_number INTEGER NOT NULL,
  type VARCHAR NOT NULL,
  amount INTEGER NOT NULL,
  date TIMESTAMP NOT NULL
);

ALTER TABLE transactions ADD CONSTRAINT account_number_FK
  FOREIGN KEY (account_number) REFERENCES accounts (account_number)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE transactions ADD CONSTRAINT verify_type
CHECK (type IN ('deposit', 'withdraw'));

ALTER TABLE transactions ALTER COLUMN date SET DEFAULT NOW();
