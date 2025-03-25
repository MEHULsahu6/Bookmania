const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/User/profile.controller');
const { jwtMiddleware } = require('../../middlewares/JWTauth');


router.get('/',jwtMiddleware, profileController.profile);

module.exports = router;