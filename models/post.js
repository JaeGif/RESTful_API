const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true, minLength: 1, maxLength: 50 },
    post: { type: String, required: true, minLength: 1, maxLength: 2000 },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    like: { type: Number },
    published: { type: Boolean, required: true },
    image: {
      img: { type: Schema.Types.ObjectId, ref: 'Image', required: true },
      url: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
