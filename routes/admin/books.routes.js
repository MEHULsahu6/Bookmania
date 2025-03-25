const express = require('express');
const router = express.Router();
const booksController = require('../../controllers/admin/books.controller');
const { jwtMiddleware } = require('../../middlewares/JWTauth');

router.get('/',jwtMiddleware, booksController.getBooks);

module.exports = router;