const Post = require('../models/post');
const Comment = require('../models/comment');
const Image = require('../models/image');
const User = require('../models/user');
const fs = require('fs');
const mongoose = require('mongoose');
const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const async = require('async');
const post = require('../models/post');
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
  let user = JSON.parse(req.body.user);
  let location = req.body.location;
  let alt = req.body.alt;
  let post = req.body.post;
  const filter = req.body.filter;
  let modifiedAlt = alt;
  let modifiedPost = post;
  let locationStr = location;
  let locationDisplayed = location;
  let taggedUsers = [];
  let taggedPost = JSON.parse(req.body.taggedPost);
  console.log(taggedPost);
  if (taggedPost.length) {
    for (let i = 0; i < taggedPost.length; i++) {
      taggedUsers.concat(taggedPost[i].user);
    }
  }
  if (locationStr == 'null') {
    locationStr = 'an unknown location';
    locationDisplayed = '';
  }
  if (modifiedAlt == 'null') {
    modifiedAlt = `An image by ${user.userName} taken in ${locationStr}`;
  }
  if (modifiedPost == 'null') {
    modifiedPost = 'I forgot to add a comment, whoops!';
  }

  const newImgId = mongoose.Types.ObjectId();
  const oldPath = `${req.files[0].path}`;
  const newPathStr = `uploads/${user._id}/${req.files[0].filename}`;

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
  } else {
    return res.sendStatus(400);
  }
  console.log('pass to post');
  const newPost = new Post({
    post: modifiedPost,
    user: {
      id: user._id,
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
    location: locationDisplayed,
    tagged: taggedUsers,
    comments: [],
  }).save((err, newPost) => {
    if (err) return console.log(err);
    else {
      console.log('full post', newPost);
      if (taggedPost.length) {
        let tagged = taggedPost;
        for (let i = 0; i < tagged.length; i++) {
          const userId = String(tagged[i].user._id);
          let updateFields = { $push: { taggedPosts: newPost._id } };
          User.findByIdAndUpdate(userId, updateFields, function (err, user) {
            if (err) console.log(err);
            else {
              console.log('success for ', user._id);
            }
          });
        }
      }
      return res.json({ newPost });
    }
  });
};

exports.post_get = (req, res, next) => {
  Post.findById(req.params.postid, function (err, post) {
    if (err) return next(err);
    else {
      let results = [post];
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
      console.log(results[0]);
      return post ? res.json({ post: results[0] }) : res.sendStatus(404);
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
  let updateFields = {};

  if (req.body.like) {
    updateFields = { like: Number(req.body.like) };
    Post.findByIdAndUpdate(req.params.postid, updateFields, (err, fullPost) => {
      if (err) console.log(err);
      else {
        return fullPost ? res.sendStatus(200) : res.sendStatus(404);
      }
    });
  }
  if (req.body.comment) {
    let user = JSON.parse(req.body.user);

    const comment = new Comment({
      comment: req.body.comment,
      user: {
        id: user._id,
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
