const express = require('express');

//router
const router = express.Router();

//model
const { signup, signin, signout } = require('../controllers/user.js');
const { userSignupValidator } = require('../validator/index');

//routes
router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

//exports
module.exports = router;