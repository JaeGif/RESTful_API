const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    comment: { type: String, required: true, minLength: 1, maxLength: 1000 },
    like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
