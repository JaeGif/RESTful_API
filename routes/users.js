var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/users', userController.users_get);
router.post('/users', userController.users_post);

/* router.get('/users/:id');
router.put('/users/:id');
router.delete('/users/:id');

router.get('/users/:id/posts'); */

module.exports = router;
