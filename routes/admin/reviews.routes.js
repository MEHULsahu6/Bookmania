const express = require('express');
const router = express.Router();
const reviewsController = require('../../controllers/admin/reviews.controller');
const { jwtMiddleware } = require('../../middlewares/JWTauth');

router.get('/',jwtMiddleware, reviewsController.getReviews);

module.exports = router;