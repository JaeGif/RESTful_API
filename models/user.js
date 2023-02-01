const mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  username: { type: String, required: true },
  password: { type: String, minLength: 6 },
  isAdmin: { type: Boolean },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }], // only display posts from follows users using user filter on post retrieval. This is very unperformant at scale. Possibly rethink for bigger data.
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  savedPosts: [],
  taggedPosts: [],
  notifications: [
    {
      type: { type: String, required: true },
      _id: { type: Schema.Types.ObjectId, required: true },
      user: {
        avatar: {
          id: { type: Schema.Types.ObjectId, ref: 'Image' },
          url: { type: String },
        },
        _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true },
      },
      post: {
        user: {
          _id: { type: Schema.Types.ObjectId, ref: 'User' },
          userName: { type: String },
          avatar: {
            id: { type: Schema.Types.ObjectId, ref: 'Image' },
            url: { type: String },
          },
        },
        _id: { type: Schema.Types.ObjectId, ref: 'Post' },
        thumbnail: {
          url: { type: String },
          alt: { type: String },
          filter: { type: String },
        },
      },
      seen: { type: Boolean },
    },
  ],
  avatar: { id: { type: String }, url: { type: String } },
  recentSearches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// plugin to handle passwords
UserSchema.plugin(passportLocalMongoose);

// Export model
module.exports = mongoose.model('User', UserSchema);
