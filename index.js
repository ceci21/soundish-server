const app = require('express')();
const bodyParser = require('body-parser');
const multer = require('multer');

const PORT = 8080;

// TODO: Change this name later to something more specific.
// Used for server actions, like logging and such.
const server = {
  log: (msg) => console.log(`[SERVER]: (MSG) - ${msg}`),
  warn: (msg) => console.warn(`[SERVER]: (WRN) * ${msg}`),  
  error: (msg) => console.error(`[SERVER]: (ERR) ! ${msg}`)
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/uploaded_audio');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now()); // TODO: Rename file names.
    // Do I need to add extension??
  }
});

const upload = multer({
  storage, // TODO: Maybe change the destination of the uploaded audio? This could also be a function... check multer docs later
  fileFilter: (req, file, callback) => {

    // Get file type.
    const fileType = file.mimetype;

    // Accept only files that include audio filetype.
    if (fileType.includes('audio/')) {
      cb(null, true);      
    } else {
      server.error('File type is not accepted.'); // TODO: Remove later      
      cb(null, false);
    }
  }
});

app.use(bodyParser);

app.get('/audio/upload', upload.array('audio'), (req, res, next) => {
  res.send('OK');
});

app.listen(PORT, () => {
  server.log(`Listening on port ${PORT}...`);
});