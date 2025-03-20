const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboard.controller');

router.get('/', dashboardController.getDashboard);

module.exports = router;