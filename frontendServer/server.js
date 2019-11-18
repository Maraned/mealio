
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
var logger = require('morgan');
const app = express();

console.log('app running', process.env.PORT || 80)

app.use(express.static(path.join(__dirname, 'build')));
app.use(logger('combined'));

app.get('/ping', function (req, res) {
    console.log('path /ping')
 return res.send('pong');
});

app.get('/', function (req, res) {
    console.log('path /')
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/home', function (req, res) {
    console.log('path /')
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 80, () => {
  console.log('App listening on port', process.env.PORT || 80);
});