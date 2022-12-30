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

  let idArray = [];
  let newPath = [];
  for (let i = 0; i < req.files.length; i++) {
    const newImgId = mongoose.Types.ObjectId();
    idArray.push(newImgId);
    const oldPath = `${req.files[i].path}`;
    const newPathStr = `uploads/${dummyUser._id}/${req.files[i].filename}`;

    fs.rename(oldPath, newPathStr, function (err) {
      if (err) throw err;
      console.log('Successfully renamed - AKA moved!');
      newPath.push(newPathStr);
    });
  }

  if (typeof req.files !== 'undefined') {
    for (let i = 0; i < req.files.length; i++) {
      const image = new Image({
        name: `${Date.now()}-odin-img`,
        url: newPath[i],
        _id: idArray[i].toString(),
      });
      image.img.contentType = 'image/jpg';
      image.save(function (err, image) {
        if (err) console.log(err);
      });
    }
  }
  console.log('post');

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
    image: idArray,
    comments: [],
  }).save((err, post) => {
    if (err) return err;
    else {
      console.log('saving');
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
