var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//********** Add support for mongo database **********
var mongo = require('mongodb');
var monk = require('monk');

var db = monk('mongodb://prog219TestDb:Shazmat:@ds056979.mlab.com:56979/terremdb');

//********** Define files that support the various routes **********
var index = require('./routes/index');      //  /Directory/filename (sans .js suffix)
var albums = require('./routes/albums');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	req.db = db;
	next();
});

//********** Bind root routes to the files referenced by the route variables defined earlier **********
app.use('/', index);
app.use('/index', index);
app.use('/albums', albums);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
