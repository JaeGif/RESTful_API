const faker = require('@faker-js/faker').faker;
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Image = require('../models/image');
const async = require('async');

const population = 90;
// import { faker } from '@faker-js/faker/locale/de';
const mongoDb = process.env.MONGO_2_URL; // DO NOT PUSH THIS TO PROD
mongoose.set('strictQuery', true);
mongoose
  .connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(console.log('connected db upload'));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongo connection error'));

function populateDB() {
  async.series(
    [
      function (cb) {
        const image = new Image({
          name: faker.lorem.word(),
          img: {
            contentType: 'image/jpg',
          },
          url: 'https://loremflickr.com/320/240',
        }).save((err, image) => {
          if (err) console.log(err);
          else {
            return cb(null, image);
          }
        });
      },
      function (cb) {
        const user = new User({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          userName: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          isAdmin: false,
        }).save((err, user) => {
          if (err) console.log(err);
          else {
            return cb(null, user);
          }
        });
      },
      function (cb) {
        const post = new Post({
          title: faker.lorem.words(Math.floor(Math.random() * 4) + 1),
          post: faker.lorem.paragraph(),
          user: faker.database.mongodbObjectId(),
          like: faker.datatype.number(300),
          published: true,
          image: {
            img: faker.database.mongodbObjectId(),
            url: 'https://loremflickr.com/320/240',
          },
        }).save((err, post) => {
          if (err) console.log(err);
          else {
            return cb(null, post);
          }
        });
      },

      function (cb) {
        const comment = new Comment({
          comment: faker.lorem.sentences(),
          like: faker.datatype.number(50),
          user: faker.database.mongodbObjectId(),
          post: faker.database.mongodbObjectId(),
        }).save((err, comment) => {
          if (err) return console.log(err);
          else {
            return cb(null, comment);
          }
        });
      },
    ],
    function (err, results) {
      if (err) console.log(err);
      else {
        return console.log('done');
      }
    }
  );
}

function run() {
  for (let i = 0; i < population; i++) {
    populateDB();
  }
}
run();
