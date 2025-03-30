const Book = require('../../models/book.model');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Get all books
const getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.render('admin/books', { books });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};

// Create a new book
const createBook = async (req, res) => {
    try {
        const { title, author, description, price, discountPrice, isbn, publisher, tags, stock } = req.body;
        
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/books/${req.file.filename}`;
        }

        const book = new Book({
            title,
            author,
            description,
            price,
            discountPrice: discountPrice || null,
            isbn: isbn || null,
            publisher: publisher || null,
            tags,
            stock,
            image: imagePath
        });

        await book.save();
        res.redirect('/admin/books');
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error });
    }
};

// Update a book
const updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, author, description, price, discountPrice, isbn, publisher, tags, stock } = req.body;
        
        const updateData = {
            title,
            author,
            description,
            price,
            discountPrice: discountPrice || null,
            isbn: isbn || null,
            publisher: publisher || null,
            tags,
            stock
        };

        if (req.file) {
            const book = await Book.findById(bookId);
            if (book.image && fs.existsSync(path.join(__dirname, '../../public', book.image))) {
                fs.unlinkSync(path.join(__dirname, '../../public', book.image));
            }
            updateData.image = `/uploads/books/${req.file.filename}`;
        }

        await Book.findByIdAndUpdate(bookId, updateData);
        res.redirect('/admin/books');
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error });
    }
};

// Delete a book
const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        
        // Validate the ID
        if (!bookId || bookId === 'undefined' || !mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Delete associated image if it exists
        if (book.image) {
            const imagePath = path.join(__dirname, '../../public', book.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Book.findByIdAndDelete(bookId);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error });
    }
};

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
    getBookById
};