const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/user/orders.controller');
const { jwtMiddleware } = require('../../middlewares/jwtAuth');

router.get('/', jwtMiddleware, ordersController.getUserOrders);
router.get('/:orderId', jwtMiddleware, ordersController.getOrderDetails);
router.post('/review', jwtMiddleware, ordersController.submitReview);

module.exports = router;