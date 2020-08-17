import React from 'react';
import './App.css';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Button, ButtonGroup, TextField, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DropzoneArea } from 'material-ui-dropzone';
import { useDropzone } from 'react-dropzone';

import ReactLoading from 'react-loading';
import Wave from 'react-wavify'

function App() {

  const classes = useStyles();
  const [latex, setLatex] = React.useState('\\text{Type your } \\LaTeX \\text{ code below, view it here!}');
  const [files, setFiles] = React.useState([]);
  const [image, setImage] = React.useState("");

  function getBase64(file) {
    const blob = new Blob([file], { type: 'image/jpg' })
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function () {
      // Remove the preceding image type statement from the string
      // and set the URL to the encoded value
      setImage(reader.result.split(',')[1]);
      console.log(reader.result.split(',')[1]);
      return reader.result.split(',')[1];
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
      return "error";
    };
  }

  React.useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'app_id': 'vivekandath_gmail_com', 'app_key': '' },
      body: JSON.stringify({ "src": `https://mathpix.com/examples/limit.jpg` })
    };
    fetch('https://api.mathpix.com/v3/text', requestOptions)
      .then(response => response.json())
      .then(data => setLatex(JSON.parse(JSON.stringify(data.latex_styled))));
  }, [image]);

  return (
    <div className="App">
      <h1 style={{ fontFamily: 'Roboto' }}>Live Equation Editor</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }} >

        <Paper style={{ height: 100, width: '60%', padding: 10 }} elevation={3} >
          <BlockMath math={(latex === "") ? `\\mathbb{CLEAR}` : String.raw`${latex}`}
            renderError={(error) => {
              return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}><ReactLoading type={"bubbles"} color={'#7303c0'} height={'5%'} width={'5%'} /></div>)
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
        style={{ marginTop: 50 }}
      />
      <ButtonGroup size="large" orientation="vertical" aria-label="large outlined primary button group" style={{ marginTop: 50 }}>
        <Button className={classes.button}>Save as Image</Button>
        <Button className={classes.button} onClick={() => setLatex("")}>CLEAR</Button>
      </ButtonGroup>
      <DropzoneArea
        filesLimit={1}
        dropzoneText={"Drag an equation image here to be scanned"}
        onChange={(fileArray) => {
          setImage(getBase64(fileArray[0]));
          console.log(image);
          setFiles(fileArray);
          console.log(fileArray);
        }}
      />
      <Wave fill="url(#gradient)">
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor="#ec38bc" />
            <stop offset="90%" stopColor="#7303c0" />
          </linearGradient>
        </defs>
      </Wave>
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
    height: 210,
    width: '48%',
    margin: 30,
  },
});

export default App;
