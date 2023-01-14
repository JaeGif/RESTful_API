const User = require('../models/user');

exports.users_get = (req, res, next) => {
  // find all users
  let { firstname, lastname, username, isadmin, reqLimit, skipToPage, q } =
    req.query;
  let resultsPerPage = 5;
  if (reqLimit) {
    resultsPerPage = Number(reqLimit);
  }
  let startIndex = 0;
  if (skipToPage) {
    startIndex = Number(skipToPage) * resultsPerPage;
  }

  // search query allows checking for real names, OR for usernames
  // make sure in names allowable, whitespace is NOT allowed in UserName OR in any name field
  // else this will throw some wild results.

  if (q) {
    // wwhitespace test regex, if whitespace is included, query is considered a firstname/lastname search.
    if (/\s/.test(q)) {
      nameArray = q.split(' ');
      for (let i = 0; i < nameArray.length; i++) {
        firstname = nameArray[0];
        lastname = nameArray[1];
      }
    } else {
      username = q;
    }
  }
  User.find({}).exec(function (err, users) {
    if (err) return next(err);
    else {
      // respond with users list
      // filter by queries
      let results = [...users];

      if (firstname && !lastname) {
        results = results.filter(
          (user) => user.firstName.toLowerCase() === firstname.toLowerCase()
        );
      }
      if (lastname && !firstname) {
        results = results.filter(
          (user) => user.lastName.toLowerCase() === lastname.toLowerCase()
        );
      }
      if (firstname && lastname) {
        results = results.filter(
          (user) =>
            // check first and last names for queried fields
            user.firstName.toLowerCase().includes(firstname.toLowerCase()) &&
            user.lastName.toLowerCase().includes(lastname.toLowerCase())
        );
      }
      if (username) {
        results = results.filter((user) =>
          user.userName.toLowerCase().includes(username.toLowerCase())
        );
        console.log(results.length);
        // search for user real name is username fails
        if (q && !results.length) {
          // check for firstname first
          // needs to check the whole array again because results is empty
          results = [...users].filter((user) =>
            user.firstName.toLowerCase().includes(q.toLowerCase())
          );
          if (!results.length) {
            // check for last name after
            results = [...users].filter((user) =>
              user.lastName.toLowerCase().includes(q.toLowerCase())
            );
          }
        }
      }

      if (isadmin) {
        results = results.filter((user) => user.isAdmin);
      }
      if (reqLimit) {
        results = results.slice(startIndex, resultsPerPage + startIndex);
      }
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
  if (req.params.clear) {
    updateFields = { $unset: { recentSearches: [] } };
    console.log('fields unsetting');
    User.findByIdAndUpdate(req.params.userid, updateFields, (err, user) => {
      if (err) console.log(err);
      else {
        console.log('fields successfully unset');
        return user ? res.sendStatus(200) : res.sendStatus(404);
      }
    });
  }
  if (req.body.searched) {
    const searchedUserId = req.body.searched;
    updateFields = { $push: { recentSearches: searchedUserId } };
    User.findById(req.params.userid, function (err, user) {
      if (err) console.log(err);
      else {
        for (let i = 0; i < user.recentSearches.length; i++) {
          // if the search is already logged, just return with no change
          if (user.recentSearches[i].toString() === searchedUserId) {
            console.log('this is a duplicate');
            console.log('recents,', user.recentSearches.length);

            return user ? res.sendStatus(200) : res.sendStatus(404);
          }
        }
        if (user.recentSearches.length >= 10) {
          // if the search is NOT logged, check length to see if it needs to be popped.
          console.log('removing last element');
          const removeLastElement = { $pop: { recentSearches: 1 } };
          console.log('recents,', user.recentSearches);
          User.findByIdAndUpdate(
            req.params.userid,
            removeLastElement,
            function (err, user) {
              if (err) throw err;
              else {
                console.log('popped');
              }
            }
          );
        }
        User.findByIdAndUpdate(req.params.userid, updateFields, (err, user) => {
          if (err) console.log(err);
          else {
            return user ? res.sendStatus(200) : res.sendStatus(404);
          }
        });
      }
    });
  }
  if (req.body.savedPost) {
    let savedPost = JSON.parse(req.body.savedPost);
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
