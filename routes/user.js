const express = require('express');

//router
const router = express.Router();

const { signup } = require('../controllers/user.js');
const { userSignupValidator } = require('../validator/index');

//routes
router.post('/signup', userSignupValidator, signup);

//exports
module.exports = router;