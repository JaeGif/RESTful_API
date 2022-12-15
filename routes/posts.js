var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');

/* GET home page. */
router.get('/posts', postController.posts_get);
router.post('/posts', postController.posts_post);

router.get('/posts/:postid', postController.post_get);
router.put('/posts/:postid', postController.post_put);
router.delete('/posts/:postid', postController.post_delete);

router.get('/posts/:postid/comments', postController.post_comments_get);

module.exports = router;
