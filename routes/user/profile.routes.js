const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/User/profile.controller');
const { jwtMiddleware } = require('../../middlewares/jwtAuth');

router.get('/', jwtMiddleware, profileController.profile);
router.post('/update-field', jwtMiddleware, profileController.updateField);  // Add this route
router.post('/update', jwtMiddleware, profileController.updateProfile);

module.exports = router;