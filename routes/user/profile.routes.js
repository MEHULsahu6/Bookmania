const express = require('express');
const router = express.Router();
const multer = require('multer');
const { upload } = require('../../config/multer.config');
const profileController = require('../../controllers/User/profile.controller');
const { jwtMiddleware } = require('../../middlewares/jwtAuth');

router.use(jwtMiddleware);

router.get('/', profileController.profile);
// Update the route path to match the frontend fetch call
router.post('/update-profile/:field', profileController.updateField);
router.post('/upload-avatar', upload.single('profileImage'), profileController.uploadAvatar);

module.exports = router;