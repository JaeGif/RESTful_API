const User = require('../models/user');

exports.users_get = (req, res, next) => {
  // find all users
  const { firstname, lastname, username, isadmin, reqLimit, skipToPage } =
    req.query;
  let resultsPerPage = 5;
  if (reqLimit) {
    resultsPerPage = Number(reqLimit);
  }
  let startIndex = 0;
  if (skipToPage) {
    startIndex = Number(skipToPage) * resultsPerPage;
  }

  User.find({}).exec(function (err, users) {
    if (err) return next(err);
    else {
      // respond with users list
      // filter by queries
      let results = [...users];

      if (firstname) {
        results = results.filter(
          (user) => user.firstName.toLowerCase() === firstname.toLowerCase()
        );
      }
      if (lastname) {
        results = results.filter(
          (user) => user.lastName.toLowerCase() === lastname.toLowerCase()
        );
      }
      if (username) {
        console.log(username);
        results = results.filter((user) =>
          user.userName.toLowerCase().includes(username.toLowerCase())
        );
      }
      if (isadmin) {
        results = results.filter((user) => user.isAdmin);
      }
      if (reqLimit) {
        results = results.slice(startIndex, resultsPerPage + startIndex);
      }
      console.log('This is the set', results);
      res.json({ users: results });
    }
  });
};

exports.users_post = (req, res, next) => {
  if (err) return next(err);
  // make a new user
  else {
    const user = new User({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      userName: req.body.username,
      password: req.body.password,
      isAdmin: false,
    }).save((err) => {
      if (err) return next(err);
      else {
        return res.statusCode(200); //ok
      }
    });
  }
};

exports.user_get = (req, res, next) => {
  User.findById(req.params.userid, function (err, user) {
    if (err) return next(err);
    else {
      return user ? res.json({ user }) : res.sendStatus(404);
    }
  });
};
exports.user_put = (req, res, next) => {
  let updateFields = {};
  if (req.body.savedPost) {
    let savedPost = JSON.parse(req.body.savedPost);
    console.log('saving, ', savedPost);
    updateFields = { $push: { savedPosts: savedPost } };
    User.findByIdAndUpdate(req.params.userid, updateFields, (err, user) => {
      if (err) console.log(err);
      else {
        return user ? res.sendStatus(200) : res.sendStatus(404);
      }
    });
  }
  if (req.body.taggedPost) {
    let taggedPost = JSON.parse(req.body.taggedPost);
    updateFields = { $push: { taggedPosts: taggedPost } };
    User.findByIdAndUpdate(req.params.userid, updateFields, (err, user) => {
      if (err) console.log(err);
      else {
        return user ? res.sendStatus(200) : res.sendStatus(404);
      }
    });
  }
};
exports.user_delete = (req, res, next) => {
  User.findByIdAndDelete(req.params.userId, function (err, user) {
    if (err) return next(err);
    else {
      res.sendStatus(200);
    }
  });
};
