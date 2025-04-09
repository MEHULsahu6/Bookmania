const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/User/cart.controller');
const  {jwtMiddleware } = require('../../middlewares/jwtAuth'); // Fix the path

router.get('/', jwtMiddleware, cartController.cart);
router.post('/add', jwtMiddleware, cartController.addToCart);
router.post('/save-address', jwtMiddleware, cartController.saveAddress);
router.post('/place-order', jwtMiddleware, cartController.placeOrder);
router.delete('/remove/:bookId', jwtMiddleware, cartController.removeFromCart);

module.exports = router;