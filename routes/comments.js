var express = require('express');
var router = express.Router();
const commentController = require('../controllers/commentController');

/* GET home page. */
router.get('/comments', commentController.comments_get);
router.post('/comments');

router.get('/comments/:commentid', commentController.comment_get);
router.put('/comments/:commentid');
router.delete('/comments/:commentid');

router.get('/comments/:commentid/:userid');

module.exports = router;
