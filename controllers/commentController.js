const Comment = require('../models/comment');

const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');

dayjs.extend(relativeTime);

exports.comments_get = (req, res, next) => {
  // get all comments and be filterable
  Comment.find({})
    .sort({ createdAt: 'desc' })
    .exec(function (err, comments) {
      if (err) return next(err);
      else {
        const { postid, userid } = req.query;
        // process for filtering
        let results = [...comments];

        // search comments by post
        if (postid) {
          results = results.filter((comment) => {
            comment.post.equals(postid);
          });
        }

        // search comments by user
        if (userid) {
          results = results.filter((comment) => {
            comment.user.equals(userid);
          });
        }
        return res.json({ comments: results });
      }
    });
};

exports.comment_get = (req, res, next) => {
  // get a single comment
  Comment.findById(req.params.commentid, function (err, comment) {
    if (err) return next(err);
    else {
      return comment ? res.json({ comment }) : res.sendStatus(404);
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
