var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');

/* GET home page. */
router.get('/posts');
router.post('/posts');

router.get('/posts/:postid');
router.put('/posts/:postid');
router.delete('/posts/:postid');

router.get('/posts/:postid/comments');
router.post('/posts/:postid/comments');

router.get('/posts/:postid/comments/:commentid');
router.put('/posts/:postid/comments/:commentid');
router.delete('/posts/:postid/comments/:commentid');

router.get('/posts/:postid/comments/:commentid/:userid');

module.exports = router;
