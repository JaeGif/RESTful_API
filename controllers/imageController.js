const Image = require('../models/image');

exports.images_get = (req, res, next) => {
  Image.find({}).exec(function (err, images) {
    if (err) return next(err);
    else {
      const { userid, postid } = req.query;
      let results = [...images];
      return images ? res.json({ results }) : res.sendStatus(404);
    }
  });
};
exports.image_get = (req, res, next) => {
  Image.findById(req.params.imageid, (err, image) => {
    if (err) return next(err);
    else {
      return image ? res.json({ image }) : res.sendStatus(404);
    }
  });
};
exports.image_delete = (req, res, next) => {
  Image.findByIdAndDelete(req.params.imageid, (err) => {
    if (err) return next(err);
    else {
      return res.sendStatus(200);
    }
  });
};
