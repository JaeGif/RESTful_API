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
mongoose
  .connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(console.log('connected to MONGO'));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

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

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});

module.exports = app;
