const express = require('express'),
  User = require('../models/user'),
  jwt = require('jwt-simple');

exports.login = function (req, res) {
  console.log('Logged In');
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log('Error Happened In auth /token Route');
    } else {
      const payload = {
        id: user._id,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7, //7 days
      };
      const token = jwt.encode(payload, process.env.JWT_SECRET);
      res.json({
        token: token,
        user: user._id,
      });
    }
  });
};

exports.register = function (req, res) {
  console.log(req.body);
  User.register(
    new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      isAdmin: false,
      following: [],
      followers: [],
      savedPosts: [],
      taggedPosts: [],
      notifications: [],
      recentSearches: [],
    }),
    req.body.password,
    function (err, msg) {
      if (err) {
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    }
  );
};
