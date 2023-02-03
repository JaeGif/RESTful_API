const express = require('express'),
  User = require('../models/user'),
  jwt = require('jwt-simple');
const { default: mongoose } = require('mongoose');
const fs = require('fs');

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
  const userId = mongoose.Types.ObjectId();

  fs.mkdirSync(`./uploads/${userId.toString()}`, { recursive: true });

  User.register(
    new User({
      _id: userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      bio: '',
      website: '',
      isAdmin: false,
      avatar: {
        id: mongoose.Types.ObjectId(),
        url: 'uploads/default/guest.png',
      },
      // user will always follow themselves
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
