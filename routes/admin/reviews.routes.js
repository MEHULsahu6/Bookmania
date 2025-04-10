const express = require('express');
const router = express.Router();
const reviewsController = require('../../controllers/admin/reviews.controller');
const { jwtMiddleware } = require('../../middlewares/jwtAuth');

router.get('/', jwtMiddleware, reviewsController.getReviews);
router.post('/update-status', jwtMiddleware, reviewsController.updateReviewStatus);

module.exports = router;