const user = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
    res.render('login');
};

exports.signup = (req, res) => {
    res.render('signup');
};

exports.loginPost = async (req, res) => {
    // Connection logic only
    res.render('login');
};

exports.signupPost = async(req, res) => {
    // Connection logic only
    res.render('signup');
};