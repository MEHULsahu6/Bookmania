const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/User/cart.controller');
const { jwtMiddleware } = require('../../middlewares/JWTauth');

router.get('/', jwtMiddleware, cartController.cart);
router.post('/add', jwtMiddleware, cartController.addToCart);
router.post('/save-address', jwtMiddleware, cartController.saveAddress);

module.exports = router;