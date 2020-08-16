// PACKAGES
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var helmet = require('helmet');
var jwt = require('express-jwt');
const initWsServer = require('./wsServer').initWsServer;

var app = express();

// ROUTES
var { router: users } = require('./routes/users');
var login = require('./routes/login');
var recipes = require('./routes/recipes');
var groceryList = require('./routes/groceryList');
var ingredients = require('./routes/ingredients');
var ingredientGroups = require('./routes/ingredientGroups');
var statistics = require('./routes/statistics');

// PARSERS
const webParser = require('./parsers/webParser');

// HTTP REQUEST HANDLING
app.use(express.static('images'))
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(helmet());

app.use(jwt({ secret: process.env.SECRET })
  .unless({
    path: [
      '/login',
      '/login/refresh',
      '/users/create',
      '/',
      '/ingredients',
      '/ingredientGroups',
      '/recipes',
    ],
    ext: '.webp'
  })
);

app.use('/users', users);
app.use('/login', login);
app.use('/recipes', recipes);
app.use('/groceryList', groceryList);
app.use('/ingredients', ingredients);
app.use('/ingredientGroups', ingredientGroups);
app.use('/statistics', statistics);

app.get('/images/:recipe/:image', function(req, res){
  const { recipe, image} = req.params;
  res.sendFile(`${__dirname}/images/${recipe}/${image}`);
});

app.get('/parse', async function(req, res) {
  const parseResult = await webParser(req.query);
  res.json(parseResult);
})

app.use(express.static('images'))

// ERROR HANDLING
app.use(function (error, request, response, next) {
  response.status(error.status || 500);
  response.json({ error: error.message });
});

// SERVER STARTUP
var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App is listening on http://%s:%s', host, port);
});

initWsServer(server);
