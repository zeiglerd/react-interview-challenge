import React from 'react';
import './App.css';
import Paper from '@mui/material/Paper'
import { Button, Grid, TextField } from '@mui/material';

function App() {
  return (
    <div className="app">
      <Grid container>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Paper sx={{ border: 20, borderBottom: 30, borderColor: 'white' }}> 
            <h1 className='app-title'>Please Sign in with your Account Number:</h1>
            <Grid container>
              <Grid item xs={2} />
              <Grid item xs={8}>
                <TextField variant='outlined' label='Account Number' sx={{ display: 'flex', margin: 'auto' }}/>
              </Grid>
              <Grid item xs={2} />
            </Grid>
            <Button variant='contained' color='primary' sx={{
              display: 'block',
              margin: 'auto',
              marginTop: 2,
            }}>Sign In</Button>
          </Paper>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </div>
  );
}

export default App;
