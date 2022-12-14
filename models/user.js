const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  userName: { type: String, required: true, minLength: 4 },
  password: { type: String, required: true, minLength: 6 },
  isAdmin: { type: Boolean },
  avatar: {
    id: { type: Schema.Types.ObjectId, ref: 'Image' },
    url: { type: String },
  },
  savedPosts: [],
  taggedPosts: [],
  notifications: [
    {
      type: { type: String },
      _id: { type: Schema.Types.ObjectId },
      user: {
        _id: { type: Schema.Types.ObjectId, ref: 'User' },
        userName: { type: String },
      },
    },
  ],
});

// Export model
module.exports = mongoose.model('User', UserSchema);
