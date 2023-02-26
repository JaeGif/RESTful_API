const faker = require('@faker-js/faker').faker;
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Image = require('../models/image');
const Notification = require('../models/notification');
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

Post.updateMany({}, { $set: { tagged: [] } }, function (err, post) {
  if (err) console.log(err);
  else {
    console.log('done with posts');
    User.updateMany(
      {},
      {
        $set: { taggedPosts: [] },
      },
      function (err, user) {
        if (err) console.log(err);
        else {
          console.log('done with users');
          Notification.deleteMany({ type: 'user/tagged' }, function (err, doc) {
            console.log('notifications tagged deleted');
            db.close();
          });
        }
      }
    );
  }
});
