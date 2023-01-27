const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  authController.login
);
router.post('/register', authController.register);

module.exports = router;
