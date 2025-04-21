const express = require('express');
const router = express.Router();
const booksController = require('../../controllers/admin/books.controller');
const { jwtMiddleware } = require('../../middlewares/jwtAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/uploads/books');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', jwtMiddleware, booksController.getBooks);
router.post('/create', jwtMiddleware, upload.single('cover'), booksController.createBook);
router.post('/update/:id', jwtMiddleware, upload.single('cover'), booksController.updateBook);

router.delete('/delete/:id', jwtMiddleware, booksController.deleteBook);
router.get('/:id', jwtMiddleware, booksController.getBookById); // Add this route
module.exports = router;