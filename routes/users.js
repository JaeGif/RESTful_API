var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/users', userController.users_get);
router.post('/users', userController.users_post);

/* router.get('/users/:userid');
router.put('/users/:userid');
router.delete('/users/:userid');
*/
module.exports = router;
