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
      const { title, userId } = req.query;
      // process for filtering
      let results = [...posts];
      // accessed using the query: /posts?title=thistitle
      if (title) {
        // removes whitespace to compare
        // filters whether a post title includes the searched query.
        let titleMod = title.toLowerCase();
        results = results.filter((post) =>
          post.title.toLowerCase().includes(titleMod)
        );
      }
      // THIS NEEDS TO BE CHANGED TO COMPARE THE RETURNED USER OBJECT TO THE STR INPUT IN THE URL
      if (userId) {
        results = results.filter((post) => post.user?.toString() === userId);
      }

      res.json({ posts: results });
    }
  });
};

exports.posts_post = (req, res, next) => {
  const post = new Post({
    title: 'hello',
    post: 'this is a cool post',
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
  // responds with comments matching the inputted postID ONLY
  const id = new mongoose.Types.ObjectId(req.params.postid);
  Comment.find({ post: id })
    .sort({ createdAt: 'desc' })
    .exec(function (err, comments) {
      if (err) return next(err);
      else {
        let results = [...comments];
        const { userid } = req.query; // find all comments only by a specific user on a post
        if (userid) {
          results.filter((comment) => comment.user.equals(userid));
        }
        res.json({ comments: results });
      }
    });
};

exports.post_comments_post = (req, res, next) => {
  // makes a new test comment on the specific postID
  const id = new mongoose.Types.ObjectId(req.params.postid);
  const DUMMYUSER = new mongoose.Types.ObjectId('639802c24e40eff770f158f4');
  //dummy comment

  const comment = new Comment({
    comment: 'I made this dummy comment',
    post: id,
    user: DUMMYUSER,
  }).save((err) => {
    if (err) return next(err);
    else {
      return res.sendStatus(200); //ok
    }
  });
};
