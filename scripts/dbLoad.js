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

const user0Id = faker.database.mongodbObjectId();
fs.mkdirSync(`./uploads/${user0Id}`, { recursive: true });
const user1Id = faker.database.mongodbObjectId();
fs.mkdirSync(`./uploads/${user1Id}`, { recursive: true });
const user2Id = faker.database.mongodbObjectId();
fs.mkdirSync(`./uploads/${user2Id}`, { recursive: true });
const user3Id = faker.database.mongodbObjectId();
fs.mkdirSync(`./uploads/${user3Id}`, { recursive: true });
const user4Id = faker.database.mongodbObjectId();
fs.mkdirSync(`./uploads/${user4Id}`, { recursive: true });

const user0 = new User({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  isAdmin: false,
  _id: user0Id,
  avatar: {
    id: faker.database.mongodbObjectId(),
    url: `https://instaapi-production.up.railway.app/uploads/${user0Id}/avatar.jpg`,
  },
});

const user1 = new User({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  isAdmin: false,
  _id: user1Id,
  avatar: {
    id: faker.database.mongodbObjectId(),
    url: `https://instaapi-production.up.railway.app/uploads/${user1Id}/avatar.jpg`,
  },
});
const user2 = new User({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  isAdmin: false,
  _id: user2Id,
  avatar: {
    id: faker.database.mongodbObjectId(),
    url: `https://instaapi-production.up.railway.app/uploads/${user2Id}/avatar.jpg`,
  },
});
const user3 = new User({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  isAdmin: false,
  _id: user3Id,
  avatar: {
    id: faker.database.mongodbObjectId(),
    url: `https://instaapi-production.up.railway.app/uploads/${user3Id}/avatar.jpg`,
  },
});
const user4 = new User({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  isAdmin: false,
  _id: user4Id,
  avatar: {
    id: faker.database.mongodbObjectId(),
    url: `https://instaapi-production.up.railway.app/uploads/${user4Id}/avatar.jpg`,
  },
});

user0.save();
user1.save();
user2.save();
user3.save();
user4.save();

function randUser() {
  const randUserNum = Math.floor(Math.random() * 4);
  let user;
  if (randUserNum === 0) {
    user = user0;
  } else if (randUserNum === 1) {
    user = user1;
  } else if (randUserNum === 2) {
    user = user2;
  } else if (randUserNum === 3) {
    user = user3;
  } else if (randUserNum === 4) {
    user = user4;
  }
  return user;
}

let user = randUser();

const comment0 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
user = randUser();

const comment1 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
user = randUser();

const comment2 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
user = randUser();

const comment3 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
user = randUser();

const comment4 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
user = randUser();

const comment5 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
user = randUser();

const comment6 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
user = randUser();

const comment7 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
user = randUser();

const comment8 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
user = randUser();

const comment9 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
user = randUser();

const comment10 = new Comment({
  comment: faker.lorem.sentences(),
  like: faker.datatype.number(5),
  user: {
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
});
comment0.save();
comment1.save();
comment2.save();
comment3.save();
comment4.save();
comment5.save();
comment6.save();
comment7.save();
comment8.save();
comment9.save();
comment10.save();

function randComment() {
  const randUserNum = Math.floor(Math.random() * 10);
  let user;
  if (randUserNum === 0) {
    user = comment0;
  } else if (randUserNum === 1) {
    user = comment1;
  } else if (randUserNum === 2) {
    user = comment2;
  } else if (randUserNum === 3) {
    user = comment3;
  } else if (randUserNum === 4) {
    user = comment4;
  } else if (randUserNum === 5) {
    user = comment5;
  } else if (randUserNum === 6) {
    user = comment6;
  } else if (randUserNum === 7) {
    user = comment7;
  } else if (randUserNum === 8) {
    user = comment8;
  } else if (randUserNum === 9) {
    user = comment9;
  } else if (randUserNum === 10) {
    user = comment10;
  } else {
    user = comment0;
  }
  return user;
}

user = randUser();
const post0 = new Post({
  title: faker.lorem.words(Math.floor(Math.random() * 4) + 1),
  post: faker.lorem.paragraph(),
  user: {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
  like: faker.datatype.number(10),
  published: true,
  image: {
    id: faker.database.mongodbObjectId(),
    url: 'https://instaapi-production.up.railway.app/uploads/image.jpg',
  },
  comments: [randComment(), randComment(), randComment()],
});
user = randUser();

const post1 = new Post({
  title: faker.lorem.words(Math.floor(Math.random() * 4) + 1),
  post: faker.lorem.paragraph(),
  user: {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
  like: faker.datatype.number(10),
  published: true,
  image: {
    id: faker.database.mongodbObjectId(),
    url: 'https://instaapi-production.up.railway.app/uploads/image.jpg',
  },
  comments: [randComment(), randComment(), randComment()],
});
user = randUser();

const post2 = new Post({
  title: faker.lorem.words(Math.floor(Math.random() * 4) + 1),
  post: faker.lorem.paragraph(),
  user: {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
  like: faker.datatype.number(10),
  published: true,
  image: {
    id: faker.database.mongodbObjectId(),
    url: 'https://instaapi-production.up.railway.app/uploads/image.jpg',
  },
  comments: [
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
  ],
});
user = randUser();

const post3 = new Post({
  title: faker.lorem.words(Math.floor(Math.random() * 4) + 1),
  post: faker.lorem.paragraph(),
  user: {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
  like: faker.datatype.number(10),
  published: true,
  image: {
    id: faker.database.mongodbObjectId(),
    url: 'https://instaapi-production.up.railway.app/uploads/image.jpg',
  },
  comments: [
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
    randComment(),
  ],
});
user = randUser();

const post4 = new Post({
  title: faker.lorem.words(Math.floor(Math.random() * 4) + 1),
  post: faker.lorem.paragraph(),
  user: {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
  like: faker.datatype.number(10),
  published: true,
  image: {
    id: faker.database.mongodbObjectId(),
    url: 'https://instaapi-production.up.railway.app/uploads/image.jpg',
  },
  comments: [],
});
user = randUser();

const post5 = new Post({
  title: faker.lorem.words(Math.floor(Math.random() * 4) + 1),
  post: faker.lorem.paragraph(),
  user: {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
  like: faker.datatype.number(10),
  published: true,
  image: {
    id: faker.database.mongodbObjectId(),
    url: 'https://instaapi-production.up.railway.app/uploads/image.jpg',
  },
  comments: [randComment()],
});
user = randUser();

const post6 = new Post({
  title: faker.lorem.words(Math.floor(Math.random() * 4) + 1),
  post: faker.lorem.paragraph(),
  user: {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
  like: faker.datatype.number(10),
  published: true,
  image: {
    id: faker.database.mongodbObjectId(),
    url: 'https://instaapi-production.up.railway.app/uploads/image.jpg',
  },
  comments: [randComment(), randComment(), randComment(), randComment()],
});
user = randUser();

const post7 = new Post({
  title: faker.lorem.words(Math.floor(Math.random() * 4) + 1),
  post: faker.lorem.paragraph(),
  user: {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    id: user._id,
    avatar: {
      id: user.avatar.id,
      url: user.avatar.url,
    },
  },
  like: faker.datatype.number(10),
  published: true,
  image: {
    id: faker.database.mongodbObjectId(),
    url: 'https://instaapi-production.up.railway.app/uploads/image.jpg',
  },
  comments: [randComment(), randComment()],
});
post0.save();
post1.save();
post2.save();
post3.save();
post4.save();
post5.save();
post6.save();
post7.save();

console.log('finnn');
/* function populateDB() {
  async.series(
    [
      function (cb) {
        const image = new Image({
          name: faker.lorem.word(),
          img: {
            contentType: 'image/jpg',
          },
          url: 'https://instaapi-production.up.railway.app/uploads/image.jpg',
        }).save((err, image) => {
          if (err) console.log(err);
          else {
            return cb(null, image);
          }
        });
      },

      function (cb) {
        const randUserNum = Math.floor(Math.random() * 4);
        let user;
        if (randUserNum === 0) {
          user = user0;
        } else if (randUserNum === 1) {
          user = user1;
        } else if (randUserNum === 2) {
          user = user2;
        } else if (randUserNum === 3) {
          user = user3;
        } else if (randUserNum === 4) {
          user = user4;
        }
        const post = new Post({
          title: faker.lorem.words(Math.floor(Math.random() * 4) + 1),
          post: faker.lorem.paragraph(),
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
          },
          like: faker.datatype.number(10),
          published: true,
          image: {
            img: faker.database.mongodbObjectId(),
            url: 'https://loremflickr.com/320/240',
          },
          comments: [{}],
        }).save((err, post) => {
          if (err) console.log(err);
          else {
            return cb(null, post);
          }
        });
      },

      function (cb) {
        const randUserNum = Math.floor(Math.random() * 4);
        let user;
        if (randUserNum === 0) {
          user = user0;
        } else if (randUserNum === 1) {
          user = user1;
        } else if (randUserNum === 2) {
          user = user2;
        } else if (randUserNum === 3) {
          user = user3;
        } else if (randUserNum === 4) {
          user = user4;
        }
        const comment = new Comment({
          comment: faker.lorem.sentences(),
          like: faker.datatype.number(5),
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            _id: user._id,
          },
          post: sss,
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
run(); */
