var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth')();

const commentController = require('../controllers/commentController');

/* GET home page. */
router.get('/comments', auth.authenticate(), commentController.comments_get);

router.get(
  '/comments/:commentid',
  auth.authenticate(),
  commentController.comment_get
);
router.put(
  '/comments/:commentid',
  auth.authenticate(),
  commentController.comment_put
);
router.delete(
  '/comments/:commentid',
  auth.authenticate(),
  commentController.comment_delete
);

module.exports = router;
