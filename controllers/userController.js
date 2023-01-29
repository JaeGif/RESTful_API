const { default: mongoose } = require('mongoose');
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
          user.username.toLowerCase().includes(username.toLowerCase())
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
      username: req.body.username,
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
  if (req.query.s) {
    let results = [];
    let count = 0;
    const suggestedLimit = Number(req.query.s);
    User.findById(req.params.userid, function (err, loggedUser) {
      if (err) console.log(err);
      else {
        User.find({ _id: { $in: loggedUser.following } }).exec(function (
          err,
          users
        ) {
          // this block suggests users you're not friends with, but your friend is following
          if (err) console.log(err);
          else {
            for (let i = 0; i < users.length; i++) {
              for (let j = 0; j < users[i].following.length; j++) {
                if (
                  !loggedUser.following.includes(
                    users[i].following[j].toString()
                  )
                ) {
                  if (count < suggestedLimit) {
                    count++;
                    results.push({
                      user: users[i].following[j].toString(),
                      // type: contact / why
                      type: 'following/follows',
                    });
                  } else break;
                }
              }
            }
            // if 5 still not fulfilled by the end of previous results
            // check for followers user is not following back
            if (count < suggestedLimit) {
              console.log(count, suggestedLimit);
              followerloop: for (
                let i = 0;
                i < loggedUser.followers.length;
                i++
              ) {
                if (
                  // if you already have this guy followed
                  loggedUser.following.includes(
                    loggedUser.followers[i].toString()
                  )
                ) {
                  continue followerloop;
                }

                followingloop: for (
                  let j = 0;
                  j < loggedUser.following.length;
                  j++
                ) {
                  if (results.length >= suggestedLimit) {
                    break followerloop;
                  }
                  if (
                    loggedUser.followers[i].toString() !==
                    loggedUser.following[j].toString()
                  ) {
                    console.log(
                      'i',
                      loggedUser.followers[i].toString(),
                      'j',
                      loggedUser.following[j].toString()
                    );
                    resultsloop: for (let k = 0; k < results.length; k++) {
                      if (
                        // don't add duplicates, and don't add yourself.
                        results[k].user ===
                          loggedUser.followers[i].toString() ||
                        loggedUser.followers[i].toString() ===
                          loggedUser._id.toString()
                      ) {
                        continue followingloop;
                      }
                    }
                    count++;
                    results.push({
                      user: loggedUser.followers[i].toString(),
                      type: 'user/follower',
                    });
                  }
                }
              }
            }
            return users
              ? res.json({ suggested: results })
              : res.sendStatus(404);
          }
        });
      }
    });
  } else {
    User.findById(req.params.userid, function (err, user) {
      if (err) console.log(err);
      else {
        return user ? res.json({ user }) : res.sendStatus(404);
      }
    });
  }
};
exports.user_put = (req, res, next) => {
  let updateFields = {};
  if (req.body.follow) {
    console.log(req.body.follow);
    let followObj = JSON.parse(req.body.follow);

    switch (followObj.type) {
      case 'follower/add':
        updateFields = { $push: { followers: followObj._id } };
        break;
      case 'follower/remove':
        updateFields = { $pull: { followers: followObj._id } };
        break;
      case 'following/add':
        updateFields = { $push: { following: followObj._id } };
        break;
      case 'following/remove':
        updateFields = { $pull: { following: followObj._id } };
        break;
      default:
        return res.sendStatus(401);
    }
    User.findByIdAndUpdate(
      req.params.userid,
      updateFields,
      function (err, user) {
        if (err) console.log(err);
        else {
          if (followObj.type === 'follower/add') {
            console.log('sending');
            User.findById(followObj._id, function (err, addedUser) {
              if (err) console.log(err);
              else {
                // cast mongoose obj to JS obj first
                addedUser = addedUser.toObject();
                User.findByIdAndUpdate(
                  user._id,
                  {
                    $push: {
                      notifications: {
                        type: 'user/follow',
                        _id: mongoose.Types.ObjectId(),
                        user: {
                          avatar: {
                            id: addedUser.avatar.id,
                            url: addedUser.avatar.url,
                          },
                          _id: addedUser._id,
                          username: addedUser.username,
                        },
                        seen: false,
                      },
                    },
                  },
                  function (err, user) {
                    if (err) console.log(err);
                  }
                );
              }
            });
          }
          return user ? res.sendStatus(200) : res.sendStatus(404);
        }
      }
    );
  }
  if (req.body.seen) {
    User.findById(req.params.userid, function (err, user) {
      if (err) console.log(err);
      else {
        console.log(user.notifications.length);
        for (let i = 0; i < user.notifications.length; i++) {
          User.findByIdAndUpdate(
            req.params.userid,
            {
              $set: {
                'notifications.$[].seen': true,
              },
            },
            function (err, user) {
              if (err) console.log(err);
            }
          );
        }
        return user
          ? res.json({ notifications: user.notifications })
          : res.sendStatus(404);
      }
    });
  }
  if (req.body.removeRecent) {
    updateFields = { $pull: { recentSearches: req.body.removeRecent } };
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
