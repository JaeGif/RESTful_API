var express = require('express');
var router = express.Router();
const commentController = require('../controllers/commentController');

/* GET home page. */
router.get('/comments', commentController.comments_get);

router.get('/comments/:commentid', commentController.comment_get);
router.put('/comments/:commentid', commentController.comment_put);
router.delete('/comments/:commentid', commentController.comment_delete);

module.exports = router;
// push for build
