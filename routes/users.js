var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth')();

const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/users', auth.authenticate(), userController.users_get);
router.post('/users', auth.authenticate(), userController.users_post);

router.get('/users/:userid', auth.authenticate(), userController.user_get);
router.put('/users/:userid', auth.authenticate(), userController.user_put);
router.delete(
  '/users/:userid',
  auth.authenticate(),
  userController.user_delete
);

module.exports = router;
