const express = require('express');
const router = express.Router();
const historyController = require('../../controllers/admin/history.controller');
const { jwtMiddleware } = require('../../middlewares/jwtAuth');

router.get('/',jwtMiddleware, historyController.getHistory);

module.exports = router;