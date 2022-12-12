var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');

/* GET home page. */
router.get('/posts');
router.get('/posts/:postid');
router.get('/posts/:postid/comments');
router.get('/posts/:postid/comments/:commentid');
router.get('/posts/:postid/comments/:commentid/:userid');

module.exports = router;
