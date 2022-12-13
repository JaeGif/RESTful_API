const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  userName: { type: String, required: true, minLength: 4 },
  password: { type: String, required: true, minLength: 6 },
  isAdmin: { type: Boolean },
});

/* UserSchema.virtual('url').get(function () {
  return `/user/${this._id}`;
}); */

// Export model
module.exports = mongoose.model('User', UserSchema);
