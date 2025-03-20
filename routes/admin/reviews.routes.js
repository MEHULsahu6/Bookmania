const express = require('express');
const router = express.Router();
const reviewsController = require('../../controllers/admin/reviews.controller');

router.get('/', reviewsController.getReviews);

module.exports = router;