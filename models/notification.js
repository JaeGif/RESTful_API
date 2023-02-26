const mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  // notifications expire time is 1 month
  createdAt: { type: Date, expires: 2628288, default: Date.now },
  type: { type: String, required: true },
  _id: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    _id: { type: Schema.Types.ObjectId, ref: 'Post' },
    thumbnail: {
      url: { type: String },
      alt: { type: String },
      filter: { type: String },
    },
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
