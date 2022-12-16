const Image = require('../models/image');
const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.images_get = (req, res, next) => {
  console.log('images?');

  Image.find({})
    .limit(3)
    .exec(function (err, images) {
      console.log('images?');
      if (err) return next(err);
      else {
        const { userid, postid } = req.query;
        let results = [...images];
        return images ? res.json({ results }) : res.sendStatus(404);
      }
    });
};
exports.image_get = (req, res, next) => {
  console.log('this is id search');
  Image.findById(req.params.imageid, (err, image) => {
    if (err) return next(err);
    else {
      return image ? res.json({ image }) : res.sendStatus(404);
    }
  });
};
exports.image_delete = (req, res, next) => {
  console.log('delete img');
  Image.findByIdAndDelete(req.params.imageid, (err) => {
    if (err) return next(err);
    else {
      return res.sendStatus(200);
    }
  });
};
