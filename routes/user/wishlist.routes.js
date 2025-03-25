const express = require('express');
const router = express.Router();
const wishlistController = require('../../controllers/User/wishlist.controller');
const { jwtMiddleware } = require('../../middlewares/JWTauth');

router.get('/',jwtMiddleware, wishlistController.wishlist);

module.exports = router;