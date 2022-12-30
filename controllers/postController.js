const Post = require('../models/post');
const Comment = require('../models/comment');
const Image = require('../models/image');
const fs = require('fs');

const mongoose = require('mongoose');
const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const async = require('async');
const post = require('../models/post');
const { request } = require('express');
const image = require('../models/image');

dayjs.extend(relativeTime);
/* MyModel.find( { createdOn: { $lte: request.createdOnBefore } } )
.limit( 10 )
.sort( '-createdOn' ) */

exports.posts_get = (req, res, next) => {
  let { title, userid, published, page, returnLimit } = req.query;
  // defaults for paginating
  if (typeof returnLimit === 'undefined') {
    returnLimit = 10;
  }
  if (typeof page === 'undefined') {
    page = 0;
  }
  const skipBy = returnLimit * parseInt(page);

  Post.find({})
    .limit(returnLimit)
    .skip(skipBy)
    .sort('-createdAt')
    .exec(function (err, posts) {
      if (err) return next(err);
      else {
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

        // Convert DateTime.

        for (let i = 0; i < results.length; i++) {
          try {
            let createdFormatted = dayjs().to(dayjs(results[i].createdAt));
            let updatedFormatted = dayjs().to(dayjs(results[i].updatedAt));

            let editedPost = false;

            if (String(results[i].createdAt) !== String(results[i].updatedAt)) {
              editedPost = true;
            }

            results[i] = {
              ...results[i]._doc,
              ...{
                createdAt: createdFormatted,
                updatedAt: updatedFormatted,
                edited: editedPost,
              },
            };
            for (let j = 0; j < results[i].comments.length; j++) {
              let commentCreatedFormatted = dayjs().to(
                dayjs(results[i].comments[j].createdAt)
              );
              let commentUpdatedFormatted = dayjs().to(
                dayjs(results[i].comments[j].updatedAt)
              );
              let edited = false;

              if (
                String(results[i].comments[j].createdAt) !==
                String(results[i].comments[j].updatedAt)
              ) {
                edited = true;
              }
              results[i].comments[j] = {
                ...results[i].comments[j],
                ...{
                  createdAt: commentCreatedFormatted,
                  updatedAt: commentUpdatedFormatted,
                  edited: edited,
                },
              };
            }
          } catch (error) {
            console.log('error parsing post/comment dates', error);
          }
        }
        res.json({ posts: results });
      }
    });
};

exports.posts_post = (req, res, next) => {
  const dummyUser = {
    avatar: {
      id: '9263f45c70879dbc56faa5c4',
      url: 'https://instaapi-production.up.railway.app/uploads/823fce52b33a845ef7554dd9/avatar.jpg',
    },
    _id: '823fce52b33a845ef7554dd9',
    firstName: 'Neal',
    lastName: 'Morissette',
    email: 'Tia_Kris@hotmail.com',
    userName: 'Eldridge_Feest40',
    isAdmin: false,
  };
  console.log(req.files);

  const newImgId = mongoose.Types.ObjectId();
  const oldPath = `${req.files[0].path}`;
  const newPathStr = `uploads/${dummyUser._id}/${req.files[0].filename}`;

  fs.renameSync(oldPath, newPathStr, function (err) {
    if (err) throw err;
    console.log('Successfully renamed - AKA moved!');
    newPath.push(newPathStr);
  });

  if (typeof req.files !== 'undefined') {
    const image = new Image({
      name: `${Date.now()}-odin-img`,
      url: newPathStr,
      _id: newImgId.toString(),
      alt: 'picture',
      filter: 'none',
    });
    image.img.contentType = 'image/jpg';
    image.save(function (err, image) {
      if (err) console.log(err);
    });
  }

  const post = new Post({
    post: req.body.post,
    user: {
      id: dummyUser._id,
      userName: dummyUser.userName,
      avatar: {
        id: dummyUser.avatar.id,
        url: dummyUser.avatar.url,
      },
    },
    like: 0,
    published: true,
    image: {
      id: newImgId.toString(),
      url: newPathStr,
      alt: 'picture',
      filter: 'none',
    },
    comments: [],
  }).save((err, post) => {
    if (err) return err;
    else {
      return res.json({ post });
    }
  });
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
