var express = require('express');
var router = express.Router();
const commentController = require('../controllers/commentController');

/* GET home page. */
router.get('/comments');
router.post('/comments');

router.get('/comments/:commentid');
router.put('/comments/:commentid');

router.get('/comments/:commentid/:userid');

module.exports = router;
