const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = require('./comment');

const PostSchema = new Schema(
  {
    title: { type: String, required: true, minLength: 1, maxLength: 50 },
    post: { type: String, required: true, minLength: 1, maxLength: 2000 },
    user: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      userName: { type: String, required: true },
    },
    like: { type: Number },
    published: { type: Boolean, required: true },
    image: {
      id: { type: Schema.Types.ObjectId, ref: 'Image', required: true },
      url: { type: String, required: true },
    },
    comments: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
