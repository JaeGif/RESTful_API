var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/users', userController.users_get);
router.post('/users', userController.users_post);

router.get('/users/:userid', userController.user_get);
router.put('/users/:userid', userController.user_put);
router.delete('/users/:userid', userController.user_delete);

module.exports = router;
