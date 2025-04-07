const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/User/home.controller');
const  {jwtMiddleware } = require('../../middlewares/jwtAuth'); // Fix the path
// Make sure these methods exist in homeController
router.get('/', homeController.home);
router.post('/add-to-cart', jwtMiddleware, homeController.addToCart);

module.exports = router;