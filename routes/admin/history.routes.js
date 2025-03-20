const express = require('express');
const router = express.Router();
const historyController = require('../../controllers/admin/history.controller');

router.get('/', historyController.getHistory);

module.exports = router;