const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/User/cart.controller');
const { jwtMiddleware } = require('../../middlewares/JWTauth');

router.get('/', jwtMiddleware, cartController.cart);
// Add new route for adding items to cart
router.post('/add', jwtMiddleware, cartController.addToCart);

module.exports = router;