const faker = require('@faker-js/faker').faker;
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Image = require('../models/image');
const async = require('async');
const fs = require('fs');

// import { faker } from '@faker-js/faker/locale/de';
const mongoDb = process.env.MONGO_2_URL; // DO NOT PUSH THIS TO PROD
mongoose.set('strictQuery', true);
mongoose
  .connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(console.log('connected db upload'));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongo connection error'));
let doneFollower = false;
let doneFollowing = false;

User.updateMany(
  {},
  { $push: { followers: ['823fce52b33a845ef7554dd9'] } },
  function (err, post) {
    if (err) console.log(err);
    else {
      console.log('finished followers push');
      doneFollower = true;
    }
  }
);

User.find({}).exec(function (err, users) {
  if (err) console.log(err);
  else {
    for (let i = 0; i < users.length; i++) {
      User.findByIdAndUpdate(
        '823fce52b33a845ef7554dd9',
        {
          $push: { following: users[i]._id },
        },
        function (err, user) {
          if (err) console.log(err);
          else {
            doneFollowing = true;
          }
        }
      );
    }
    console.log('finished following pushes');
  }
});
