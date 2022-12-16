var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

/* GET home page. */
router.get('/posts', postController.posts_get);
router.post('/posts', upload.array('image', 10), postController.posts_post);

router.get('/posts/:postid', postController.post_get);
router.put('/posts/:postid', postController.post_put);
router.delete('/posts/:postid', postController.post_delete);

router.get('/posts/:postid/comments', postController.post_comments_get);

module.exports = router;
