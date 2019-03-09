require('dotenv').config()
var Gun = require('gun/gun');

const express = require('express');
const app = express();
const port = 3001;

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const login = require('./routes/login');

app.use('/login', login);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

var gun = Gun({web: app});
