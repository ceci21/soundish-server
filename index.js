const app = require('express')();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const PORT = 4444;

// TODO: Change this name later to something more specific.
// Used for server actions, like logging and such.
const server = {
  log: (msg) => console.log(`[SERVER]: (MSG) - ${msg}`),
  warn: (msg) => console.warn(`[SERVER]: (WRN) * ${msg}`),  
  error: (msg) => console.error(`[SERVER]: (ERR) ! ${msg}`)
};


app.use(cors());

app.use(fileUpload());

app.post('/audio/upload', (req, res, next) => {
  server.log('Uploading audio files...');
  let i = 0;  
  const files = req.files['audio[]'] || [req.files['audio']];
  const dirName = 'uploaded_audio/'
  for (let n = 0; n < files.length; n++) {
    const file = files[n];
    const fileName = file.name;
    const fileBuffer = Buffer.from(file.data);
    fs.writeFile(dirName + fileName, fileBuffer, 'base64', (err) => {
      server.log('Uploading file' + fileName);
      if (err) {
        server.error(err);
        res.status(400).send({ error: `Error uploading audio file ${fileName}` });
      } else {
        server.log('File ' + fileName + ' saved!');
        if (n === files.length - 1 && i === files.length - 1) {
          res.status(200).send('OK'); // TODO: Update response message
        }
        i++;        
      };
    });
  }
});

app.get('/audio', (req, res, next) => {
  console.log('getting audio!!!');
  const dir = './uploaded_audio/'
  fs.readdir(dir, (err, fileNames) => {
    if (err) {
      return server.error(err);
    }
    res.status(200).send(fileNames); // TODO: Update response message
  });
});

app.get('/audio/:song_name', (req, res, next) => {
  const dir = 'uploaded_audio/';
  const path = dir + req.params.song_name;


  fs.readFile(path, 'base64', (err, file) => {
    res.setHeader('Content-Type', 'audio/mp3');
    res.send(file);
  });

  // fs.readFile()
  // fs.readdir(dir, (err, files) => {
  //   console.log(files);
  //   if (err) {
  //     return server.error(err);
  //   }
  //   res.status(200).send(files); // TODO: Update response message
  // });
  // res.send('...');
});

app.listen(PORT, () => {
  server.log(`Listening on port ${PORT}...`);
});