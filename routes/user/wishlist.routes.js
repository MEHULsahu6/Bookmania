const express = require('express');
const router = express.Router();
const wishlistController = require('../../controllers/User/wishlist.controller');
const { jwtMiddleware } = require('../../middlewares/jwtAuth');

// Protect all routes with JWT middleware
router.use(jwtMiddleware);

// Wishlist routes
router.get('/', wishlistController.getWishlist);
router.post('/toggle', wishlistController.toggleWishlist);
router.delete('/remove/:bookId', wishlistController.removeFromWishlist);

module.exports = router;