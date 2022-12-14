const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const async = require('async');
const { body, validationResult } = require('express-validator');

dayjs.extend(relativeTime);

exports.users_get = (req, res, next) => {
  // find all users
  User.find({}).exec(function (err, users) {
    if (err) return next(err);
    else {
      // respond with users list
      res.json({ users });
    }
  });
};

exports.users_post = (req, res, next) => {
  if (err) return next(err);
  // make a new user
  else {
    const user = new User({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      userName: req.body.username,
      password: req.body.password,
      isAdmin: false,
    }).save((err) => {
      if (err) return next(err);
      else {
        return res.statusCode(200); //ok
      }
    });
  }
};
exports.user_get = (req, res, next) => {
  User.findById(req.params.userid, function (err, user) {
    if (err) return next(err);
    else {
      res.json({ user });
    }
  });
};
exports.user_put = (req, res, next) => {
  User.findByIdAndUpdate(req.params.userid, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password, // THIS NEEDS TO BE HASHED
    isAdmin: req.body.isAdmin,
  }).save((err) => {
    if (err) return next(err);
    else {
      res.sendStatus(200);
    }
  });
};
exports.user_delete = (req, res, next) => {
  User.findByIdAndDelete(req.params.userId, function (err, user) {
    if (err) return next(err);
    else {
      res.sendStatus(200);
    }
  });
};
