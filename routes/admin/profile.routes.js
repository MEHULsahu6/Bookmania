const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/admin/profile.controller');

router.get('/', profileController.getProfile);
// Add new POST route for updating profile
router.post('/update', profileController.updateProfile);

module.exports = router;