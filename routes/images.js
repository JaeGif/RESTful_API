const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const auth = require('../middleware/auth')();

/* GET home page. */
router.get('/images', auth.authenticate(), imageController.images_get);

router.get('/images/:imageid', auth.authenticate(), imageController.image_get);
router.delete(
  '/images/:imageid',
  auth.authenticate(),
  imageController.image_delete
);
router.delete('/images', auth.authenticate(), imageController.images_delete);

module.exports = router;
