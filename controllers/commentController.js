const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const mongoose = require('mongoose');
const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const async = require('async');
const { body, validationResult } = require('express-validator');

dayjs.extend(relativeTime);

exports.comments_get = (req, res, next) => {
  // get all comments and be filterable
  Comment.find({})
    .sort({ createdAt: 'desc' })
    .exec(function (err, comments) {
      if (err) return next(err);
      else {
        const { postId, userId } = req.query;
        // process for filtering
        let results = [...comments];

        // search comments by post
        if (postId) {
          results = results.filter((comment) => {
            comment.post.equals(postId);
          });
        }

        // search comments by user
        if (userId) {
          results = results.filter((comment) => {
            comment.user.equals(userId);
          });
        }
        res.json({ comments: results });
      }
    });
};

exports.comment_get = (req, res, next) => {
  // get a single comment
  Comment.findById(req.params.commentid, function (err, comment) {
    if (err) return next(err);
    else {
      res.json({ comment });
    }
  });
};

exports.comment_delete = (req, res, next) => {
  Comment.findByIdAndDelete(req.params.commentid, function (err, comment) {
    if (err) return next(err);
    else {
      res.sendStatus(200);
    }
  });
};

exports.comment_put = (req, res, next) => {
  // only the comment can be updated
  Comment.findByIdAndUpdate(req.params.commentid, {
    comment: req.body.comment,
  }).save((err) => {
    if (err) return next(err);
    else {
      res.sendStatus(200);
    }
  });
};
