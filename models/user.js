const mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  website: { type: String },
  bio: { type: String, maxLength: 150 },
  username: { type: String, required: true },
  password: { type: String, minLength: 6 },
  isAdmin: { type: Boolean },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }], // only display posts from follows users using user filter on post retrieval. This is very unperformant at scale. Possibly rethink for bigger data.
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  savedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  taggedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notication' }],
  /*     {
      type: { type: String, required: true },
      _id: { type: Schema.Types.ObjectId, required: true },
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      post: {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        _id: { type: Schema.Types.ObjectId, ref: 'Post' },
        thumbnail: {
          url: { type: String },
          alt: { type: String },
          filter: { type: String },
        },
      },
      seen: { type: Boolean },
    }, */

  avatar: { type: String },
  recentSearches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// plugin to handle passwords
UserSchema.plugin(passportLocalMongoose);

// Export model
module.exports = mongoose.model('User', UserSchema);
