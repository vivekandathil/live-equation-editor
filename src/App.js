import React from 'react';
import './App.css';

// Used to render the latex code provided in the text field
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Button, ButtonGroup, TextField, Link, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// For the drag and drop functionality 
import { DropzoneArea } from 'material-ui-dropzone';
// A nicer thing to display in place of a ParseError (while the user is in the middle of typing latex)
import ReactLoading from 'react-loading';
// Wave animation at the bottom of the page
import Wave from 'react-wavify'
// To upload equation snippets to an S3 bucket
import S3 from 'aws-s3';
import { keys } from './keys.js';

const config = {
  bucketName: 'assets-vjk',
  dirName: 'snippets',
  region: 'ca-central-1',
  accessKeyId: keys.s3ID,
  secretAccessKey: keys.s3Secret,
}

// Generate a unique id string to name files uploaded to the S3 bucket
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function App() {

  const classes = useStyles();
  // The latex code to be rendered
  const [latex, setLatex] = React.useState('\\text{Type your } \\LaTeX \\text{ code or drag/drop an image below! }');
  // The files from the dropzone
  const [files, setFiles] = React.useState([]);
  const [image, setImage] = React.useState("");
  // Where to access the image to send to the OCR API
  const [imageURL, setImageURL] = React.useState("");

  // Call the MathPix OCR API every time a new image is dragged/dropped
  React.useEffect(() => {
    if (imageURL !== "") {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'app_id': keys.email, 'app_key': keys.mathpix },
        body: JSON.stringify({ "src": `${imageURL}` })
      };
      fetch('https://api.mathpix.com/v3/text', requestOptions)
        .then(response => response.json())
        .then(data => setLatex(JSON.parse(JSON.stringify(data.latex_styled))));
    }
  }, [imageURL])

  return (
    <div className="App">
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          borderRadius: 8,
          height: 75,
          margin: 16,
          justifyContent: 'center'
        }}>
          <h1 style={{ fontFamily: 'Roboto', textAlign: 'center', color: 'black' }}>Live Equation Editor</h1>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }} >

        <Paper style={{ height: 140, width: '60%', padding: 10 }} elevation={3} >
          <BlockMath math={(latex === "") ? `\\mathbb{CLEAR}` : String.raw`${latex}`}
            renderError={(error) => {
              return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                  <ReactLoading type={"bubbles"} color={'#7303c0'} height={'5%'} width={'5%'} />
                </div>)
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
        style={{ marginTop: 25, width: '60%' }}
      />
      <ButtonGroup size="large" orientation="vertical" aria-label="large outlined primary button group" style={{ marginTop: 50 }}>

      </ButtonGroup>
      <div style={{ marginBottom: 50 }}>
        <a className={classes.symbolabButton} target='_blank' href={"https://www.symbolab.com/solver/step-by-step/" + encodeURIComponent(latex)}>
          Symbolab
      </a>
        <a className={classes.wolframButton} target='_blank' href={"https://www.wolframalpha.com/input/?i=" + encodeURIComponent(latex)}>
          Wolfram Alpha
      </a>
        <Button className={classes.button}>Save as Image</Button>
        <Button className={classes.button} onClick={() => setLatex("")}>CLEAR</Button>

      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <DropzoneArea
          dropzoneClass={classes.dropzone}
          filesLimit={1}
          dropzoneText={"Drag an equation image here to be scanned"}
          onChange={(fileArray) => {
            // Upload the snippet to an S3 bucket with a randomized filename
            const S3Client = new S3(config);
            const fileName = `snippet_${makeid(8)}`;

            // When resolved, change the imageURL to trigger the OCR API call
            S3Client
              .uploadFile(fileArray[0], fileName)
              .then(data => setImageURL(data.location))
              .catch(err => console.error(err));

            // Set the current file to the image
            setFiles(fileArray);
          }}
        />
      </div>
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
  symbolabButton: {
    background: 'linear-gradient(45deg, #FF416C 30%, #FF4B2B 90%)',
    border: 0,
    borderRadius: 8,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 28,
    padding: 20,

    fontWeight: 'bold',
    textDecoration: 'none'

  },
  wolframButton: {
    background: 'linear-gradient(45deg, #f12711 10%, #f5af19 90%)',
    border: 0,
    borderRadius: 8,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 28,
    padding: 20,
    marginLeft: 30,
    fontWeight: 'bold',
    textDecoration: 'none'

  },
  dropzone: {
    width: '60%'
  },
  button: {
    background: 'linear-gradient(45deg, #ec38bc 30%, #7303c0 90%)',
    border: 0,
    borderRadius: 8,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 56,
    padding: 20,
    marginLeft: 30
  },
  latexInput: {
    height: 100,
    margin: 30,
  },
});

export default App;
