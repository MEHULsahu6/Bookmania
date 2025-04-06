const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/User/cart.controller');
const { jwtMiddleware } = require('../../middlewares/JWTauth');

// Apply JWT authentication middleware to protect the profile route
router.get('/', jwtMiddleware, cartController.cart);

module.exports = router;