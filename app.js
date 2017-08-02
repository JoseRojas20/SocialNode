var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var config = require('./config');

require('./models/user');
require('./passport')(passport);

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
// Configuración de Express
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: 'ksdj877898jsdh98u',
  resave: false,
  saveUninitialized: false
}))

mongoose.connect(config.mongo.path,
  function(err, res) {
    if(err) throw err;
    console.log('Conectado con Exito a la BD');
});

app.get('/', function(req, res){
  var user = null;
  if(req.session.passport && req.session.passport.user)
   user = req.session.passport.user;
  res.render('index', {
    title: 'Passport-Example',
    user: user
  });
});

app.get('/logout', function(req, res) {
  req.session.passport.logout();
  res.redirect('/');
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successRedirect: '/',
    failureRedirect: '/login'
  }));

app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/',
    failureRedirect: '/login'
  }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
