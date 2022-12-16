const Image = require('../models/image');
const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');
const async = require('async');
const { body, validationResult } = require('express-validator');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.images_get = (req, res, next) => {
  Image.find({}).exec(function (err, images) {
    if (err) return next(err);
    else {
      const { userid, postid } = req.query;
      let results = [...images];
      console.log(results);
      return images ? res.json({ results }) : res.sendStatus(404);
    }
  });
};
exports.images_post = (req, res, next) => {
  const image = new Image({
    name: `${Date.now()}-odin-img`,
    user: req.body.userid, // current user Str
    post: req.body.postid,
  });
  image.img.data = req.file.image.buffer;
  image.img.contentType = 'image/jpg';

  image.save(function (err) {
    if (err) return next(err);
    else {
      return res.sendStatus(200);
    }
  });
};
