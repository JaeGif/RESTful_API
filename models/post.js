const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true, minLength: 1, maxLength: 50 },
    post: { type: String, required: true, minLength: 1, maxLength: 200 },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    published: { type: Boolean, required: true },
    image: { type: Schema.Types.ObjectId, ref: 'Image' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
