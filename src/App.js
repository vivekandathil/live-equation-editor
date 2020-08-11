import React from 'react';
import logo from './logo.svg';
import './App.css';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Button, ButtonGroup, TextField, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function App() {

  const classes = useStyles();

  const [latex, setLatex] = React.useState('\\text{Type your } \\LaTeX \\text{ code below, view it here!}');

  return (
    <div className="App">
      <h1 style={{ fontFamily: 'Roboto' }}>LaTeX Editor</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }} >

        <Paper style={{ height: 100, width: '60%', padding: 10 }} elevation={3} >
          <BlockMath math={String.raw`${latex}`}
            renderError={(error) => {
              return <b>{error.name}: Still typing?</b>
            }}
            errorColor={'#7303c0'} />
        </Paper>

      </div>
      <TextField
        id="outlined-multiline-static"
        label="LaTeX Source Code"
        multiline
        rows={4}
        defaultValue='\text{Type your latex code below, view it here!}'
        variant="outlined"
        value={latex}
        onChange={(event) => {
          console.log(event.target.value);
          setLatex(event.target.value);
        }}
        className={classes.latexInput}
      />
      <ButtonGroup size="large" orientation="vertical" aria-label="large outlined primary button group">
        <Button className={classes.button}>Save LaTeX</Button>
        <Button className={classes.button}>Save as Image</Button>
        <Button className={classes.button}>CLEAR</Button>
      </ButtonGroup>
    </div>
  );
}

const useStyles = makeStyles({
  button: {
    background: 'linear-gradient(45deg, #ec38bc 30%, #7303c0 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    marginBottom: 10
  },
  latexInput: {
    height: 300,
    width: '48%',
    margin: 30,
  }
});

export default App;
