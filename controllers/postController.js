const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const async = require('async');
const { body, validationResult } = require('express-validator');

dayjs.extend(relativeTime);

exports.module.posts_get = (req, res, next) => {
  Post.find({}).exec(function (err, posts) {
    if (err) return next(err);
    else {
      const { title, user, updatedAt } = req.query;
      // process for filtering
      let results = [...posts];
      if (title) {
        results.filter((post) => post.title === title);
      }
      // THIS NEEDS TO BE CHANGED TO COMPARE THE RETURNED USER OBJECT TO THE STR INPUT IN THE URL
      if (user) {
        results.filter((post) => post.user === user);
      }
      // THIS NEEDS TO BE CHANGED TO BE MORE ROBUST SEARCHING WITHIN TIMEFRAMES
      if (updatedAt) {
        results.filter((post) => post.updatedAt === updatedAt);
      }
      res.json({ posts: results });
    }
  });
};

exports.module.posts_post = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    post: req.body.post,
    user: dummy, // current user,
  });
};
