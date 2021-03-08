var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// require hbs
const hbs = require("hbs");

// require mongoose
require("./config/mongoose");

var indexRouter = require('./routes/index');
// set up staff router
var staffRouter = require('./routes/staff');
// set up editor router
var editorRouter = require('./routes/editor');
// set up admim router
var adminRouter = require('./routes/head');
// set auth router
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// partials setup
hbs.registerPartials(path.join(__dirname, "views/partials"))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// use staff router
app.use('/staff', staffRouter);
// use editor router
app.use('/editor', editorRouter);
// use admin router
app.use('/head', adminRouter);
// use auth router
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
