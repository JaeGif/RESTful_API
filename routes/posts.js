var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/imageUpload');
var auth = require('../middleware/auth')();

/* GET home page. */
router.get('/posts', auth.authenticate(), postController.posts_get);
router.post(
  '/posts',
  auth.authenticate(),
  upload.array('image', 10),
  postController.posts_post
);

router.get('/posts/:postid', auth.authenticate(), postController.post_get);
router.post('/posts/:postid', auth.authenticate(), postController.post_post);
router.delete(
  '/posts/:postid',
  auth.authenticate(),
  postController.post_delete
);

router.get(
  '/posts/:postid/comments',
  auth.authenticate(),
  postController.post_comments_get
);

module.exports = router;
