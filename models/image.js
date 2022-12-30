const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  _id: { type: String },
  name: { type: String },
  img: {
    contentType: String,
    alt: { type: String },
    filter: { type: String },
    adjustments: {
      brightness: { type: Number },
      contrast: { type: Number },
      saturation: { type: Number },
      temperature: { type: Number },
      fade: { type: Number },
      vignette: { type: Number },
    },
  },
  url: { type: String, required: true },
});

module.exports = mongoose.model('Image', ImageSchema);
