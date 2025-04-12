const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/admin/orders.controller');
const { jwtMiddleware } = require('../../middlewares/jwtAuth'); // Fix the path

router.get('/', jwtMiddleware, ordersController.getOrders);
router.post('/update-status', jwtMiddleware, ordersController.updateOrderStatus);
router.delete('/delete/:orderId', jwtMiddleware, ordersController.deleteOrder); // Add this line

module.exports = router;