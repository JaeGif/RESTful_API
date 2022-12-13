const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const mongoose = require('mongoose');

const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const async = require('async');
const { body, validationResult } = require('express-validator');

dayjs.extend(relativeTime);

exports.posts_get = (req, res, next) => {
  Post.find({}).exec(function (err, posts) {
    if (err) return next(err);
    else {
      const { title, user, updatedAt } = req.query;
      // process for filtering
      let results = [...posts];
      // accessed using the query: /posts?title=thistitle
      if (title) {
        // removes whitespace to compare
        results.filter(
          (post) =>
            post.title.replace(/\s/g, '').toLowerCase() === title.toLowerCase()
        );
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

exports.posts_post = (req, res, next) => {
  const post = new Post({
    title: 'new',
    post: 'post',
  }).save((err) => {
    if (err) return next(err);
    else {
      return res.sendStatus(200); //ok
    }
  });
};
exports.post_get = (req, res, next) => {
  Post.findById(req.params.postid, function (err, post) {
    if (err) return next(err);
    else {
      res.json({ post });
    }
  });
};
exports.post_comments_get = (req, res, next) => {
  console.log(req.params.postid);
  const id = new mongoose.Types.ObjectId(req.params.postid);
  console.log(id);
  Comment.find({ post: id }).exec(function (err, comments) {
    console.log(comments);
    if (err) return next(err);
    else {
      res.json({ comments });
    }
  });
};
