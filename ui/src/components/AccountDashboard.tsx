import React, { useState, useEffect } from "react"
import {account} from "../Types/Account"
import Paper from "@mui/material/Paper/Paper";
import { Button, Card, CardContent, Grid, List, ListItem, ListItemText, TextField } from "@mui/material";

type AccountDashboardProps = {
  account: account;
  signOut: () => Promise<void>;
}

const updateWithdrawnTodayTotal = (account: account) => {
  const withdrawnTodayTotal = JSON.parse(localStorage.getItem('withdrawnTodayTotal') ?? '{}');
  withdrawnTodayTotal[account.accountNumber] = account.withdrawnTodayTotal;
  localStorage.setItem('withdrawnTodayTotal', JSON.stringify(withdrawnTodayTotal));
};

const getWithdrawnTodayTotal = (account: account) => JSON.parse(localStorage.getItem('withdrawnTodayTotal') ?? '{}')[account.accountNumber] ?? 0;

export const AccountDashboard = (props: AccountDashboardProps) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositErrors, setDepositErrors] = useState<string[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawErrors, setWithdrawErrors] = useState<string[]>([]);
  const [account, setAccount] = useState(props.account);

  const {signOut} = props;

  const depositFunds = async () => {
    setDepositErrors([]);
    setWithdrawErrors([]);
    const errors = []

    if (depositAmount > Number(process.env.REACT_APP_DEPOSIT_MAX_TRANSACTION)) {
      errors.push(`Cannot deposit more than $${process.env.REACT_APP_DEPOSIT_MAX_TRANSACTION} in a single transaction.`);
    }

    if (account.type === 'credit') {
      const newAmount = depositAmount + account.amount;
      if (newAmount > 0) {
        errors.push('Cannot deposit more in your account than is needed to reach a zero balance.');
      }
    }

    if (errors.length) {
      return setDepositErrors(errors);
    }

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({amount: depositAmount})
    }
    const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/deposit`, requestOptions);
    const data = await response.json();

    if (data.error) {
      return setDepositErrors([data.error]);
    }

    setAccount({
      accountNumber: data.account_number,
      name: data.name,
      amount: data.amount,
      type: data.type,
      creditLimit: data.credit_limit
    });
  }

  const withdrawFunds = async () => {
    setDepositErrors([]);
    setWithdrawErrors([]);
    const errors = []

    if (withdrawAmount > Number(process.env.REACT_APP_WITHDRAW_MAX_TRANSACTION)) {
      errors.push(`Can withdraw no more than $${process.env.REACT_APP_WITHDRAW_MAX_TRANSACTION} in a single transaction.`);
    }

    const withdrawnTodayTotal = getWithdrawnTodayTotal(account)
    if (withdrawnTodayTotal + withdrawAmount > Number(process.env.REACT_APP_WITHDRAW_MAX_DAILY)) {
      errors.push(`Can withdraw no more than $${process.env.REACT_APP_WITHDRAW_MAX_DAILY} in a single day. You have withdrawn $${withdrawnTodayTotal}.`);
    }

    if (withdrawAmount % Number(process.env.REACT_APP_WITHDRAW_DIVISIBLE) !== 0) {
      errors.push(`Can only withdraw an amount that can be dispensed in $${process.env.REACT_APP_WITHDRAW_DIVISIBLE} bills.`);
    }

    if (account.type === 'credit') {
      const availableCredit = account.creditLimit + account.amount;
      if (withdrawAmount > availableCredit) {
        errors.push(`Cannot withdraw more than your credit limit. Your credit limit is $${account.creditLimit}.`);
      }
    } else if (withdrawAmount > account.amount) {
      errors.push('Cannot withdraw more than you have in your account.');
    }

    if (errors.length) {
      return setWithdrawErrors(errors);
    }

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({amount: withdrawAmount})
    }
    const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/withdraw`, requestOptions);
    const data = await response.json();

    if (data.error) {
      return setWithdrawErrors([data.error]);
    }

    setAccount({
      accountNumber: data.account_number,
      name: data.name,
      amount: data.amount,
      type: data.type,
      creditLimit: data.credit_limit,
      withdrawnTodayTotal: data.withdrawnTodayTotal
    });
  }

  useEffect(() => {
    updateWithdrawnTodayTotal(account);
  }, [account]);

  return (
    <Paper className="account-dashboard">
      <div className="dashboard-header">
        <h1>Hello, {account.name}!</h1>
        <Button variant="contained" onClick={signOut}>Sign Out</Button>
      </div>
      <h2>Balance: ${account.amount}</h2>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={6}>
          <Card className="deposit-card">
            <CardContent>
              <h3>Deposit</h3>
              { depositErrors && <List className='deposit-errors'>
                {depositErrors.map((error, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={error} />
                  </ListItem>
                ))}
              </List> }
              <TextField
                id="deposit-amount"
                label="Deposit Amount"
                variant="outlined"
                type="number"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={(e) => setDepositAmount(+e.target.value)}
              />
              <Button
                id="deposit-btn"
                variant="contained"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                  marginTop: 2}}
                onClick={depositFunds}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="withdraw-card">
            <CardContent>
              <h3>Withdraw</h3>
              { withdrawErrors && <List className='withdraw-errors'>
                {withdrawErrors.map((error, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={error} />
                  </ListItem>
                ))}
              </List> }
              <TextField
                id="withdraw-amount"
                label="Withdraw Amount"
                variant="outlined"
                type="number"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={(e) => setWithdrawAmount(+e.target.value)}
              />
              <Button
                id="withdraw-btn"
                variant="contained"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                  marginTop: 2
                }}
                onClick={withdrawFunds}
                >
                  Submit
                </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>

  )
}
