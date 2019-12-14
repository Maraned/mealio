
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
var logger = require('morgan');
const app = express();

console.log('app running', process.env.PORT || 8800)

app.use(express.static(path.join(__dirname, 'build')));
app.use(logger('combined'));

app.get('/', function (req, res) {
    console.log('path /')
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/*', function (req, res) {
  console.log('path /')
res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(8800, () => {
  console.log('App listening on port', 8800);
});