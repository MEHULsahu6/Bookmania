const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboard.controller');
const { jwtMiddleware } = require('../../middlewares/jwtAuth');

// Add JWT middleware to protect the route
router.get('/', jwtMiddleware, dashboardController.getDashboard);

module.exports = router;