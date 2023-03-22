const Comment = require('../models/comment');

const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
var updateLocale = require('dayjs/plugin/updateLocale');
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in%s',
    past: '%s',
    s: 'now',
    m: 'a minute ago',
    mm: '%dm',
    h: 'an hour ago',
    hh: '%dh',
    d: 'a day ago',
    dd: '%d days ago',
    M: 'a month ago',
    MM: '%dmo',
    y: 'a year ago',
    yy: '%dy',
  },
});

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
      let result;
      let edited = false;
      let createdFormatted = dayjs().to(dayjs(comment.createdAt));
      let updatedFormatted = dayjs().to(dayjs(comment.updatedAt));

      if (String(comment.createdAt) !== String(comment.updatedAt)) {
        edited = true;
      }
      console.log(createdFormatted);
      createdFormatted = createdFormatted.toLowerCase();
      updatedFormatted = updatedFormatted.toLowerCase();
      result = {
        ...comment._doc,
        ...{
          createdAt: createdFormatted,
          updatedAt: updatedFormatted,
          edited: edited,
        },
      };
      console.log(comment);
      console.log(result);
      return comment ? res.json({ comment: result }) : res.sendStatus(404);
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
