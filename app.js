const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const createError = require('http-errors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

require('dotenv').config();

const mongoDb = process.env.MONGO_STR;
mongoose.set('strictQuery', true);
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', postsRouter);
app.use('/api', usersRouter);

/* // catch 404 and forward to error handler after all other routes
app.use(function (req, res) {
  res.status(404).json();
}); */

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
