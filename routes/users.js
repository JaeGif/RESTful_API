const express = require('express');
const router = express.Router();
const upload = require('../middleware/imageUpload');

const auth = require('../middleware/auth')();

const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/users', auth.authenticate(), userController.users_get);
router.post('/users/usernames', userController.usernames_check);
router.post('/users', auth.authenticate(), userController.users_post);
router.get('/users/:userid', auth.authenticate(), userController.user_get);
router.get(
  '/users/:userid/notifications',
  auth.authenticate(),
  userController.user_notifications_get
);
router.get(
  '/users/:userid/notifications/:notificationid',
  auth.authenticate(),
  userController.user_notification_get
);

router.put(
  '/users/:userid',
  upload.single('image'),
  auth.authenticate(),
  userController.user_put
);
router.delete(
  '/users/:userid',
  auth.authenticate(),
  userController.user_delete
);

module.exports = router;
