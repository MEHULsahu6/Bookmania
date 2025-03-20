const express = require('express');
const router = express.Router();
const booksController = require('../../controllers/admin/books.controller');

router.get('/', booksController.getBooks);

module.exports = router;