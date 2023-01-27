const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const localStrategy = require('passport-local');

const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');
const imagesRouter = require('./routes/images');
const User = require('./models/user');
const auth = require('./middleware/auth.js')();

require('dotenv').config();

const mongoDb = process.env.MONGO_2_URL; // DO NOT PUSH Mongo_2_URL
mongoose.set('strictQuery', true);
mongoose
  .connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(console.log('connected'));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();

app.use(auth.initialize());
// Passport Config
passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));
app.use(cors());

app.use('/', authRouter);
app.use('/api', postsRouter);
app.use('/api', usersRouter);
app.use('/api', commentsRouter);
app.use('/api', imagesRouter);

// catch 404 and forward to error handler after all other routes
app.use(function (req, res) {
  res.status(404).json();
});

// error handler middleware to be customized a lil bit
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error json
  res.status(err.status || 500);
  res.json({ err: res.locals.message });
});

module.exports = app;
