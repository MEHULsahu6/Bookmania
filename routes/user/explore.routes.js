const express = require('express');
const router = express.Router();
const exploreController = require('../../controllers/User/explore.controller');

router.get('/', exploreController.explore);

module.exports = router;