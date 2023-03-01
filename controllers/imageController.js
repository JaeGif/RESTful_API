const Image = require('../models/image');
const fs = require('fs');

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
exports.images_delete = (req, res, next) => {
  const images = JSON.parse(req.body.images);
  const user = req.body.user;

  // user is the user id hex
  // images is the image array to be deleted
  console.log(images, user);
  Image.find(
    {
      _id: { $in: images },
    },
    function (err, docs) {
      if (err) console.log(err);
      else {
        console.log('docs', docs);
        for (let i = 0; i < docs.length; i++) {
          fs.unlink(`${docs[i].url}`, (err) => {
            if (err) console.log(err);
            else {
              console.log('deleted image successfully');
            }
          });

          Image.deleteMany({ _id: { $in: images } }, function (err, status) {
            if (err) console.log(err);
            else {
              console.log('deleted');
            }
          });
        }
      }
    }
  );
};
