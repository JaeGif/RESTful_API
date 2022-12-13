const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const async = require('async');
const { body, validationResult } = require('express-validator');

dayjs.extend(relativeTime);

exports.module.users_get = (req, res, next) => {
  // find all users
  User.find({}).exec(function (err, users) {
    if (err) return next(err);
    else {
      // respond with users list
      res.json({ users });
    }
  });
};

exports.module.users_post = (req, res, next) => {
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
