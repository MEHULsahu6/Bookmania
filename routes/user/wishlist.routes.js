const express = require('express');
const router = express.Router();
const wishlistController = require('../../controllers/User/wishlist.controller');
const { jwtMiddleware } = require('../../middlewares/JWTauth');

router.get('/', jwtMiddleware, wishlistController.wishlist);
router.post('/toggle', jwtMiddleware, wishlistController.toggleWishlist);
router.delete('/remove/:bookId', jwtMiddleware, wishlistController.removeFromWishlist);

module.exports = router;