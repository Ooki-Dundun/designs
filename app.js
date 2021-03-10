const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// require hbs
const hbs = require("hbs");
// require flash
const flash = require("connect-flash");

// require express-session
const session = require('express-session');

// register hbs helpers
// helper to display last value of array
hbs.registerHelper("last", (array) => array[(array.length - 1)]);


// require mongoose
require("./config/mongoose");

const indexRouter = require('./routes/index');
// set up staff router
const staffRouter = require('./routes/staff');
// set up editor router
const editorRouter = require('./routes/editor');
// set up admim router
const adminRouter = require('./routes/head');
// set auth router
const authRouter = require('./routes/auth');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// partials setup
hbs.registerPartials(path.join(__dirname, "views/partials"))

app.use(logger('dev'));
app.use(express.json()); // expose asynchronous posted data in req.body
app.use(express.urlencoded({ extended: false })); // expose synchronous posted data in req.body
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initialize session
app.use(
  session({
      secret: process.env.SESS_SECRET, // secret used to sign the session ID cookie
      saveUninitialized: false,
      resave: false, // session does not need to be resaved if not modified
      cookie: { maxAge: 3600000 } // disappears after 1 hour
  })
)

//initialize flash
app.use(flash());

// require middlewares
app.use(require("./middlewares/displayflashmessages"));
app.use(require("./middlewares/showloginstatus"));

app.use('/', indexRouter);
// use staff router
app.use('/staff', staffRouter);
// use editor router
app.use('/editor', editorRouter);
// use admin router
app.use('/head', adminRouter);
// use auth router
app.use('/auth', authRouter);

// app.use(require("./middlewares/exposeFlashMessages"));

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
