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
          results = results.filter(
            (post) => post.user.id.toString() === userid
          );
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
  if (taggedPost.length) {
    taggedUsers = taggedPost;
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
    like: [],
    _id: mongoose.Types.ObjectId(),
  }).save((err, newPost) => {
    if (err) return console.log(err);
    else {
      if (taggedPost.length) {
        let tagged = taggedPost;
        for (let i = 0; i < tagged.length; i++) {
          const userId = String(tagged[i].user._id);
          let updateFields = { $push: { taggedPosts: newPost._id } };
          User.findByIdAndUpdate(userId, updateFields, function (err, user) {
            if (err) console.log(err);
            else {
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
    const likedBy = JSON.parse(req.body.like);
    // find individual post to check for likes
    console.log('recieved like');

    Post.findById(req.params.postid, function (err, post) {
      if (err) console.log(err);
      else {
        updateFields = { $push: { like: likedBy } };
        for (let i = 0; i < post.like.length; i++) {
          if (post.like[i]._id === likedBy._id) {
            updateFields = {
              $pull: { like: { _id: likedBy._id } },
            };
          }
        }
      }
      // find individual post to appropriately update likes
      Post.findByIdAndUpdate(
        req.params.postid,
        updateFields,
        (err, fullPost) => {
          if (err) console.log(err);
          else {
            console.log('found post');

            User.findById(fullPost.user.id, function (err, user) {
              if (err) console.log(err);
              else {
                console.log('found post author');
                console.log(user.notifications);

                if (user.notifications.length !== 0) {
                  for (let i = 0; i < user.notifications.length; i++) {
                    console.log('entering loop');
                    // if the notification is already present, DO NOT SEND
                    if (
                      user.notifications[i].type === 'post/like' &&
                      user.notifications[i].user._id.toString() === likedBy._id
                    ) {
                      console.log('this notification already exists');
                      return user ? res.sendStatus(200) : res.sendStatus(404);
                    } else {
                      // send notification to correct user
                      User.findByIdAndUpdate(
                        user._id,
                        {
                          $push: {
                            notifications: {
                              type: 'post/like',
                              _id: req.params.postid,
                              user: {
                                _id: likedBy._id,
                                userName: likedBy.userName,
                              },
                            },
                          },
                        },
                        function (err, user) {
                          if (err) console.log(err);
                          else {
                            console.log('new notification');
                            return user
                              ? res.sendStatus(200)
                              : res.sendStatus(404);
                          }
                        }
                      );
                    }
                  }
                } else {
                  // send notification to correct user
                  User.findByIdAndUpdate(
                    user._id,
                    {
                      $push: {
                        notifications: {
                          type: 'post/like',
                          _id: req.params.postid,
                          user: {
                            _id: likedBy._id,
                            userName: likedBy.userName,
                          },
                        },
                      },
                    },
                    function (err, user) {
                      if (err) console.log(err);
                      else {
                        console.log('new notification');
                        return user ? res.sendStatus(200) : res.sendStatus(404);
                      }
                    }
                  );
                }
              }
            });
          }
        }
      );
      // send like notification
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
