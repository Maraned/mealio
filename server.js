// // PACKAGES
// var express = require('express');
// var logger = require('morgan');
// var bodyParser = require('body-parser');
// var cors = require('cors');
// var helmet = require('helmet');
// var jwt = require('express-jwt');
// console.log('server setup')

// var app = express();

// // ROUTES 
// var users = require('./routes/users');
// var login = require('./routes/login');
// var recipes = require('./routes/recipes');
// var groceryList = require('./routes/groceryList');
// var ingredients = require('./routes/ingredients');
// var statistics = require('./routes/statistics');

// // HTTP REQUEST HANDLING
// app.use(express.static('images'))
// app.use(logger('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(cors());
// app.use(helmet());

// app.use(jwt({ secret: process.env.SECRET })
//   .unless({ 
//     path: [
//       '/api/login', 
//       '/api/login/refresh', 
//       '/api/users/create',
//     ],
//     ext: '.webp'
//   })
// );


// app.use('/api/users', users);
// app.use('/api/login', login);
// app.use('/api/recipes', recipes);
// app.use('/api/groceryList', groceryList);
// app.use('/api/ingredients', ingredients);
// app.use('/api/statistics', statistics);

// // ERROR HANDLING
// app.use(function (error, request, response, next) {
//   response.status(error.status || 500);
//   response.json({ error: error.message });
// });

// // SERVER STARTUP
// var server = app.listen(3001, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('App is listening on http://%s:%s', host, port);
// });

// PACKAGES
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var helmet = require('helmet');
var jwt = require('express-jwt');
console.log('server setup')

var app = express();

// ROUTES 
var users = require('./routes/users');
var login = require('./routes/login');
var recipes = require('./routes/recipes');
var groceryList = require('./routes/groceryList');
var ingredients = require('./routes/ingredients');
var statistics = require('./routes/statistics');

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
      '/api/login', 
      '/api/login/refresh', 
      '/api/users/create',
    ],
    ext: '.webp'
  })
);


app.use('/api/users', users);
app.use('/api/login', login);
app.use('/api/recipes', recipes);
app.use('/api/groceryList', groceryList);
app.use('/api/ingredients', ingredients);
app.use('/api/statistics', statistics);

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

