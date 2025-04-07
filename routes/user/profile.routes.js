const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/User/profile.controller');
const { jwtMiddleware } = require('../../middlewares/JWTauth');

router.get('/', jwtMiddleware, profileController.profile);
// Add these new routes
router.post('/update-profile/phone', jwtMiddleware, profileController.updatePhone);
router.post('/update-profile/gender', jwtMiddleware, profileController.updateGender);

module.exports = router;