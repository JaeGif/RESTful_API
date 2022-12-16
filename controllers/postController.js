const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Image = require('../models/image');

const mongoose = require('mongoose');
const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const async = require('async');
const { body, validationResult } = require('express-validator');
const post = require('../models/post');

dayjs.extend(relativeTime);

exports.posts_get = (req, res, next) => {
  Post.find({}).exec(function (err, posts) {
    if (err) return next(err);
    else {
      const { title, userid, published } = req.query;
      // process for filtering
      let results = [...posts];
      if (title) {
        results = results.filter((post) =>
          post.title.toLowerCase().includes(title.toLowerCase())
        );
      }
      if (userid) {
        // takes uID string
        results = results.filter((post) => post.user?.toString() === userid);
      }
      if (published) {
        // takes bool
        results = results.filter((post) => post.published === published);
      }

      res.json({ posts: results });
    }
  });
};

exports.posts_post = (req, res, next) => {
  console.log('start');
  async.series(
    [
      function (cb) {
        console.log('post');
        const post = new Post({
          title: 'hello',
          post: 'this is a cool post',
          published: false,
        }).save((err, post) => {
          if (err) return cb(err);
          else {
            return cb(null, post);
          }
        });
      },
      function (cb) {
        if (typeof req.files !== 'undefined') {
          for (let i = 0; i < req.files.length; i++) {
            console.log('image');
            const image = new Image({
              name: `${Date.now()}-odin-img`,
              url: `${req.files[i].path}`,
              post: post._id,
            });
            image.img.contentType = 'image/jpg';

            image.save(function (err, image) {
              if (err) return cb(err);
              else {
                return cb(null, image);
              }
            });
          }
        }
      },
    ],
    function (err, post) {
      if (err) return next(err);
      else {
        return res.sendStatus(200);
      }
    }
  );
};
exports.post_get = (req, res, next) => {
  Post.findById(req.params.postid, function (err, post) {
    if (err) return next(err);
    else {
      return post ? res.json({ post }) : res.sendStatus(404);
    }
  });
};

exports.post_delete = (req, res, next) => {
  Post.findByIdAndDelete(req.params.postid, function (err, post) {
    if (err) return next(err);
    else {
      res.sendStatus(200);
    }
  });
};
exports.post_put = (req, res, next) => {
  // DONE
  Post.findByIdAndUpdate(req.params.postid, req.body, (err, post) => {
    if (err) return next(err);
    else {
      return post ? res.sendStatus(200) : res.sendStatus(404);
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
        return res.json({ comments: results });
      }
    });
};
