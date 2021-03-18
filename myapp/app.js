var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var upload = multer();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/* 작업시작 */
require('dotenv').config();
var bodyParser = require('body-parser');
var session = require('express-session')
const mongoose = require('mongoose');
const connect=require('./lib/db.js'); 
connect();

//app.use(upload.array()); // for parsing multipart/form-data

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(bodyParser.text());

app.use(cookieParser(process.env.COOKIE_SECRET));

/*일반 컴퓨터 메모리 세션 사용*/
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

/*몽고세션스토어 사용*/
/*
const MongoStore = require('connect-mongo')(session);
const sessionStore= new MongoStore({ mongooseConnection: mongoose.connection });
let sessionMiddleWare=session({  
  key: 'express.sid',
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge:6000000,
  }
});
app.use(sessionMiddleWare);
*/

/*이 코드 대신 */
/*
 var passport=require('passport');
app.use(passport.initialize());
app.use(passport.session());
*/
/*아래코드 사용*/
var passport= require('./lib/passport.js')(app);


var aboutRouter = require('./routes/about');
app.use('/about', aboutRouter);


var boardRouter = require('./routes/board');
app.use('/board', boardRouter);

var galleryRouter = require('./routes/gallery');
app.use('/gallery', galleryRouter);
var msgRouter = require('./routes/msg');
app.use('/msg', msgRouter);

/*코드완료*/

app.use('/', indexRouter);
app.use('/user', usersRouter);


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
