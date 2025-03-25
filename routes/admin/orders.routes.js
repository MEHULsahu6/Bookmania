const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/admin/orders.controller'); 
const { jwtMiddleware } = require('../../middlewares/JWTauth');

router.get('/',jwtMiddleware, ordersController.getOrders);

module.exports = router;