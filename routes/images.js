var express = require('express');
var router = express.Router();
const imageController = require('../controllers/imageController');

/* GET home page. */
router.get('/images', imageController.images_get);
router.post('/images', imageController.images_post);

router.get('/images/:imageid', imageController.image_get);
router.delete('/images/:imageid', imageController.image_delete);

module.exports = router;
