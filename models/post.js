const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = require('./comment');

const PostSchema = new Schema(
  {
    post: { type: String, required: true, minLength: 1, maxLength: 2000 },
    user: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      userName: { type: String, required: true },
      avatar: {
        id: { type: Schema.Types.ObjectId, ref: 'Image' },
        url: { type: String },
      },
    },
    like: { type: Number },
    published: { type: Boolean, required: true },
    image: {
      id: { type: Schema.Types.ObjectId, ref: 'Image' },
      url: { type: String },
      alt: { type: String },
      filter: { type: String },
    },
    comments: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
