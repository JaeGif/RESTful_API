const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    comment: { type: String, required: true, minLength: 1, maxLength: 200 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

/* PostSchema.virtual('url').get(function () {
  return `/home/posts/${this._id}`;
}); */

module.exports = mongoose.model('Comment', CommentSchema);
