const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  userName: { type: String, required: true, minLength: 4 },
  password: { type: String, required: true, minLength: 6 },
  isAdmin: { type: Boolean },

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
        userName: { type: String, required: true },
      },
      post: {
        _id: { type: Schema.Types.ObjectId, ref: 'Post' },
        thumbnail: {
          url: { type: String },
          alt: { type: String },
        },
      },
      seen: { type: Boolean },
    },
  ],
  recentSearches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// Export model
module.exports = mongoose.model('User', UserSchema);
