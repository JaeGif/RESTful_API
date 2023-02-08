const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    post: { type: String, required: true, minLength: 1, maxLength: 2000 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    published: { type: Boolean, required: true },
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    location: { type: String },
    tagged: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
