const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true, minLength: 1, maxLength: 50 },
    post: { type: String, required: true, minLength: 1, maxLength: 200 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

/* PostSchema.virtual('url').get(function () {
  return `/home/posts/${this._id}`;
});
 */

module.exports = mongoose.model('Post', PostSchema);
