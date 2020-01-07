const express = require('express');

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

//router
const router = express.Router();

//model
const { userById } = require('../controllers/user');

router.get('/test/:userId', requireSignin, isAuth, (req, res) => {
    res.json({
        user: req.profile
    });
});

//routes
router.param('userId', userById);

//exports
module.exports = router;