const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/User/profile.controller');

router.get('/', profileController.profile);

module.exports = router;