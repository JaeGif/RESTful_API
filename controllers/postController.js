const Post = require('../models/post');
const Comment = require('../models/comment');
const Image = require('../models/image');
const fs = require('fs');
const mongoose = require('mongoose');
const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const async = require('async');
const post = require('../models/post');
const image = require('../models/image');
const { contentType } = require('express/lib/response');

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
  let user = JSON.parse(req.body.user);
  let location = req.body.location;
  let alt = req.body.alt;
  let post = req.body.post;
  const filter = req.body.filter;

  let modifiedAlt = alt;
  let locationStr = location;

  if (locationStr == 'null') {
    locationStr = 'an unknown location';
  }
  if (modifiedAlt == 'null') {
    modifiedAlt = `An image by ${user.userName} taken in ${locationStr}`;
  }

  const newImgId = mongoose.Types.ObjectId();
  const oldPath = `${req.files[0].path}`;
  const newPathStr = `uploads/${user.id}/${req.files[0].filename}`;

  fs.renameSync(oldPath, newPathStr, function (err) {
    if (err) throw err;
    newPath.push(newPathStr);
  });

  if (typeof req.files !== 'undefined') {
    const image = new Image({
      name: `${Date.now()}-odin-img`,
      url: newPathStr,
      _id: newImgId.toString(),
      alt: modifiedAlt,
      filter: filter,
    });
    image.img.contentType = req.files[0].mimetype;
    image.save(function (err, image) {
      if (err) console.log(err);
    });
  }

  const newPost = new Post({
    post: post,
    user: {
      id: user.id,
      userName: user.userName,
      avatar: {
        id: user.avatar.id,
        url: user.avatar.url,
      },
    },
    like: 0,
    published: true,
    image: {
      id: newImgId.toString(),
      url: newPathStr,
      alt: modifiedAlt,
      filter: filter,
      contentType: req.files[0].mimetype,
    },
    location: location,
    comments: [],
  }).save((err, newPost) => {
    console.log(newPost.image.contentType);
    if (err) return err;
    else {
      return res.json({ newPost });
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

exports.post_post = (req, res, next) => {
  // DONE
  let updateFields = {};
  /*   let user = {
    avatar: {
      id: '96aeffbdfeafb48bbfbc8cea',
      url: 'https://instaapi-production.up.railway.app/uploads/fe0db393eeaeaa8530a38e1d/avatar.jpg',
    },
    _id: 'fe0db393eeaeaa8530a38e1d',
    firstName: 'Osborne',
    lastName: 'Crooks',
    email: 'Lavonne_Bradtke@yahoo.com',
    userName: 'Rhea67',
    password: 'XECx6ylxRz4ylw5',
    isAdmin: false,
    __v: 0,
  }; */
  if (req.body.like) {
    console.log(req.body);
    updateFields = { like: Number(req.body.like) };
    Post.findByIdAndUpdate(req.params.postid, updateFields, (err, fullPost) => {
      console.log('adding like');
      if (err) console.log(err);
      else {
        console.log('returning like');
        return fullPost ? res.sendStatus(200) : res.sendStatus(404);
      }
    });
  }
  if (req.body.comment) {
    let user = JSON.parse(req.body.user);

    const comment = new Comment({
      comment: req.body.comment,
      user: {
        id: user.id,
        userName: user.userName,
        avatar: {
          id: user.avatar.id,
          url: user.avatar.url,
        },
      },
    }).save((err, comment) => {
      if (err) return console.log(err);
      else {
        updateFields = {
          $push: { comments: comment },
        };
        Post.findByIdAndUpdate(
          req.params.postid,
          updateFields,
          (err, fullPost) => {
            if (err) return next(err);
            else {
              return fullPost ? res.sendStatus(200) : res.sendStatus(404);
            }
          }
        );
      }
    });
  }
  if (req.body.post) {
    let user = JSON.parse(req.body.user);

    updateFields = { post: req.body.post };
    Post.findByIdAndUpdate(req.params.postid, updateFields, (err, fullPost) => {
      if (err) return next(err);
      else {
        return fullPost ? res.sendStatus(200) : res.sendStatus(404);
      }
    });
  }
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
