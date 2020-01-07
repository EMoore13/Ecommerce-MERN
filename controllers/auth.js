//model
const User = require('../models/user');
const {errorHandler} = require('../helpers/dbErrorHandler');

//authentication packages
const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');

//signup
exports.signup = (req, res) => {
    console.log(req.body);

    //gets information for post action
    const user = new User(req.body);

    //saves new user to database
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }

        //blocks password or salt from showing in view
        user.salt = undefined;
        user.hashed_password = undefined;

        res.json({
            user
        });
    });
};

//signin
exports.signin = (req, res) => {
    console.log('Login Page');

    //find user by email
    const { email, password } = req.body;

    //data lookup
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: 'User with that email does not exist'
            });
        }

        //check password
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and Password do not match'
            });
        }

        //generate signin token
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

        //persist token as 't' and expiration date
        res.cookie('t', token, {expire: new Date() + 9999});

        //respond to frontend client
        const { _id, name, email, role } = user;
        return res.json({token, user: {_id, email, name, role}});
    })
};

//signout
exports.signout = (req, res) => {
    console.log('signed out');

    //clears cookies
    res.clearCookie('t');
    res.json({message: 'Signout successful!'});
};

exports.requireSignin = ejwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;

    if (!user) {
        return res.status(403).json({error: 'Forbidden Access'});
    }

    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        res.status(403).json({error: 'Forbidden Access'});
    }

    next();
}