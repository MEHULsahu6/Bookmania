const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/admin/profile.controller');
const { jwtMiddleware } = require('../../middlewares/jwtAuth');

router.get('/', jwtMiddleware, profileController.getProfile);
router.post('/update', jwtMiddleware, profileController.updateProfile); // Multer is handled in controller

module.exports = router;