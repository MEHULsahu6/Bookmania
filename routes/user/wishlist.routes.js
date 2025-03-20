const express = require('express');
const router = express.Router();
const wishlistController = require('../../controllers/User/wishlist.controller');

router.get('/', wishlistController.wishlist);

module.exports = router;