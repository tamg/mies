var express = require('express');
var path = require('path');
var logger = require('morgan');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

module.exports = app;
