const faker = require('@faker-js/faker').faker;
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');
const User = require('./models/user');
const Comment = require('./models/comment');
const Image = require('./models/image');

const population = 10;
// import { faker } from '@faker-js/faker/locale/de';
const mongoDb = process.env.MONGO_2_URL; // DO NOT PUSH THIS TO PROD
mongoose.set('strictQuery', true);
mongoose
  .connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(console.log('connected db upload'));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongo connection error'));
function randomDoc(Model) {
  Model.count().exec(function (err, count) {
    // Get a random entry
    let random = Math.floor(Math.random() * count);

    // Again query all users but only fetch one offset by our random #
    Model.findOne()
      .skip(random)
      .exec(function (err, result) {
        if (err) return next(err);
        return result._id;
      });
  });
}

for (let i = 0; i <= population; i++) {
  const image = new Image({
    name: faker.lorem.word,
    img: {
      contentType: 'image/jpg',
    },
    url: faker.image.nightlife(),
  });
  const user = new User({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    isAdmin: false,
  }).save((err) => {
    if (err) console.log(err);
  });
  const post = new Post({
    title: faker.lorem.words(Math.floor(Math.random() * 4)),
    post: faker.lorem.paragraph(),
    user: randomDoc(User),
    like: faker.datatype.number(300),
    published: true,
    image: randomDoc(Image),
  }).save((err) => {
    if (err) console.log(err);
  });
  const comment = new Comment({
    comment: faker.lorem.sentences(),
    like: faker.datatype.number(50),
    user: randomDoc(User),
    post: randomDoc(Post),
  });
}
console.log('finished');
