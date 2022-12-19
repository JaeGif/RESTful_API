const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    comment: { type: String, required: true, minLength: 1, maxLength: 1000 },
    like: { type: Number },
    user: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      userName: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
