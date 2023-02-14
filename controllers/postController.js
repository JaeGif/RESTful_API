const Post = require('../models/post');
const Comment = require('../models/comment');
const Image = require('../models/image');
const User = require('../models/user');
const fs = require('fs');
const mongoose = require('mongoose');
const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const sharp = require('sharp');

dayjs.extend(relativeTime);

exports.posts_get = (req, res, next) => {
  let { title, userid, published, page, returnLimit, u } = req.query;
  // defaults for paginating
  if (typeof returnLimit === 'undefined') {
    returnLimit = 10;
  }
  if (typeof page === 'undefined') {
    page = 0;
  }
  const skipBy = returnLimit * parseInt(page);

  if (u) {
    User.findById(u, function (err, user) {
      if (err) console.log(err);
      else {
        const usersToDisplay = [...user.following, u];
        Post.find({ user: { $in: usersToDisplay } })
          .limit(returnLimit)
          .skip(skipBy)
          .sort('-createdAt')
          .exec(function (err, posts) {
            if (err) console.log(err);
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
                  (post) => post.user.toString() === userid
                );
              }
              if (published) {
                // takes bool
                results = results.filter(
                  (post) => post.published === published
                );
              }
              // Convert DateTime.

              for (let i = 0; i < results.length; i++) {
                try {
                  let createdFormatted = dayjs().to(
                    dayjs(results[i].createdAt)
                  );
                  let updatedFormatted = dayjs().to(
                    dayjs(results[i].updatedAt)
                  );

                  let editedPost = false;

                  if (
                    String(results[i].createdAt) !==
                    String(results[i].updatedAt)
                  ) {
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
                } catch (error) {
                  console.log('error parsing post/comment dates', error);
                }
              }
              res.json({ posts: results });
            }
          });
      }
    });
  } else {
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
            results = results.filter((post) => post.user.toString() === userid);
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

              if (
                String(results[i].createdAt) !== String(results[i].updatedAt)
              ) {
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
  }
};

exports.posts_post = (req, res, next) => {
  let user = req.body.user;
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
    modifiedAlt = `An image by ${user.username} taken in ${locationStr}`;
  }
  if (modifiedPost == 'null') {
    modifiedPost = 'I forgot to add a comment, whoops!';
  }

  // handle adding multiple images/contents
  // first make image id's since these will be needed async with Post, and now the async post reqs can be taken out of the for loop
  // with no need for fancy promises, or the like. These idx are assigned appropriately when their image is allllll done.
  let imageIdx = [];
  for (let i = 0; i < req.files.length; i++) {
    imageIdx.push(mongoose.Types.ObjectId());
  }
  for (let i = 0; i < req.files.length; i++) {
    const oldPath = `${req.files[i].path}`;
    const dateRef = new Date().toISOString();
    let newPathStr = `uploads/${user}/${dateRef}_${req.files[i].filename}.jpeg`;
    if (req.files[i].mimetype.includes('image')) {
      sharp(oldPath)
        .rotate()
        .resize({ fit: 'inside', width: 800 })
        .jpeg({ lossless: true, quality: 95 })
        .toFile(newPathStr, (err, info) => {
          fs.unlink(oldPath, (err) => {
            if (err) throw err;
          });

          if (typeof req.files !== 'undefined') {
            const image = new Image({
              name: `${Date.now()}-odin-img`,
              url: newPathStr,
              _id: imageIdx[i],
              alt: modifiedAlt,
              filter: filter,
            });
            image.img.contentType = req.files[i].mimetype;
            image.save(function (err, image) {
              if (err) console.log(err);
            });
          } else {
            return res.sendStatus(400);
          }
        });
    } else {
      // video content
      newPathStr = `uploads/${user}/${req.files[i].filename}`;

      fs.renameSync(oldPath, newPathStr, function (err) {
        if (err) throw err;
        newPath.push(newPathStr);
      });
      if (typeof req.files !== 'undefined') {
        const image = new Image({
          name: `${Date.now()}-odin-img`,
          url: newPathStr,
          _id: imageIdx[i],
          alt: modifiedAlt,
          filter: filter,
        });
        image.img.contentType = req.files[i].mimetype;
        image.save(function (err, image) {
          if (err) console.log(err);
        });
      } else {
        return res.sendStatus(400);
      }
    }

    // New POST BREAKPOINT
  }
  const newPost = new Post({
    post: modifiedPost,
    user: user,
    published: true,
    images: imageIdx,
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
        newPost = newPost.toObject();
        for (let i = 0; i < tagged.length; i++) {
          const userId = String(tagged[i].user);
          let updateFields = {
            $push: {
              taggedPosts: newPost._id,
              notifications: {
                type: 'user/tagged',
                post: {
                  user: newPost.user,
                  _id: newPost._id,
                  thumbnail: {
                    url: newPost.image[0].url,
                    alt: newPost.image[0].alt,
                    filter: newPost.image[0].filter,
                  },
                },
                seen: false,
              },
            },
          };
          User.findByIdAndUpdate(userId, updateFields, function (err, user) {
            if (err) console.log(err);
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

    Post.findById(req.params.postid, function (err, post) {
      if (err) console.log(err);
      else {
        console.log(post.like, likedBy);
        console.log('like');

        updateFields = { $push: { like: likedBy._id } };
        for (let i = 0; i < post.like.length; i++) {
          console.log('removing like');
          if (post.like[i].toString() === likedBy._id) {
            updateFields = {
              $pull: { like: likedBy._id },
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

            User.findById(fullPost.user, function (err, user) {
              if (err) console.log(err);
              else {
                if (user.notifications.length !== 0) {
                  for (let i = 0; i < user.notifications.length; i++) {
                    // if the notification is already present, DO NOT SEND
                    if (
                      user.notifications[i].type === 'post/like' &&
                      user.notifications[i]._id.toString() ===
                        fullPost._id.toString() &&
                      user.notifications[i].user.toString() === likedBy._id
                    ) {
                      console.log('this notification already exists');
                      return user ? res.sendStatus(200) : res.sendStatus(404);
                    }
                  }
                  console.log(likedBy);
                  // send notification to correct user
                  User.findByIdAndUpdate(
                    user,
                    {
                      $push: {
                        notifications: {
                          type: 'post/like',
                          _id: req.params.postid,
                          user: likedBy._id,

                          post: {
                            _id: likedBy.post._id,
                            thumbnail: {
                              url: likedBy.post.thumbnail.url,
                              alt: likedBy.post.thumbnail.alt,
                            },
                          },
                          seen: false,
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
                } else {
                  // send notification to correct user if there are NO notifications
                  User.findByIdAndUpdate(
                    user,
                    {
                      $push: {
                        notifications: {
                          type: 'post/like',
                          _id: req.params.postid,
                          user: likedBy._id,

                          post: {
                            _id: likedBy.post._id,
                            thumbnail: {
                              url: likedBy.post.thumbnail.url,
                              alt: likedBy.post.thumbnail.alt,
                            },
                          },
                          seen: false,
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
      user: user,
      replies: [],
      like: [],
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
