import React, { useState } from "react"
import {account} from "../Types/Account"
import Paper from "@mui/material/Paper/Paper";
import { Button, Card, CardContent, Grid, TextField } from "@mui/material";

type AccountDashboardProps = {
  account: account;
  signOut: () => Promise<void>;
}

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
    // if (withdrawAmount > process.env.REACT_APP_WITHDRAW_MAX_DAILY) { // @TODO
    //   errors.push(`Can withdraw no more than $${process.env.REACT_APP_WITHDRAW_MAX_DAILY} in a single day.`);
    // }
    if (withdrawAmount % Number(process.env.REACT_APP_WITHDRAW_DIVISIBLE) !== 0) {
      errors.push(`Can only withdraw an amount that can be dispensed in $${process.env.REACT_APP_WITHDRAW_DIVISIBLE} bills.`);
    }
    if (account.type === 'credit') {
      let availableCredit = account.creditLimit;
      availableCredit += account.amount;
      if (withdrawAmount > availableCredit) {
        errors.push('Cannot withdraw more than your credit limit.');
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
      creditLimit: data.credit_limit
    });
  }

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
              {depositErrors ?? depositErrors}
              <TextField 
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
              {withdrawErrors ?? withdrawErrors}
              <TextField 
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
