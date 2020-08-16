const express = require('express');
const path = require('path');
const app = express();

console.log('setting up frontend server');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(8800);
