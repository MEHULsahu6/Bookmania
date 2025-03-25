const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/admin/orders.controller'); 

router.get('/', ordersController.getOrders);

module.exports = router;