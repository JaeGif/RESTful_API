const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    comment: { type: String, required: true, minLength: 1, maxLength: 1000 },
    like: { type: Number },
    user: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
      avatar: {
        id: { type: Schema.Types.ObjectId, ref: 'Image' },
        url: { type: String },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
