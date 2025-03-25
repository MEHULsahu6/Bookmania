const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/login', authController.login);
router.get('/signup', authController.signup);
router.post('/login', authController.loginPost);
router.post('/signup', authController.signupPost);

module.exports = router;
