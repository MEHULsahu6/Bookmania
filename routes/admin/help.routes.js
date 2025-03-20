const express = require('express');
const router = express.Router();
const helpController = require('../../controllers/admin/help.controller');

router.get('/', helpController.getHelp);

module.exports = router;