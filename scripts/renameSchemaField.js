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

Post.updateMany(
  {},
  { $rename: { 'user.id': 'user._id' } },
  { multi: true },
  function (err, blocks) {
    if (err) {
      throw err;
    } else {
      db.close();
    }
    console.log('done!');
  }
);
