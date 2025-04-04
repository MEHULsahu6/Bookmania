const Book = require('../../models/book.model');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Get all books for the current admin
const getBooks = async (req, res) => {
    try {
        const adminId =req.user.id; // Assuming JWT middleware adds admin profile ID to req.user
        const books = await Book.find({ admin: adminId });
        res.render('admin/books', { books });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};

// Create a new book
const createBook = async (req, res) => {
    try {
        const adminId =req.user.id;
        const { title, author, description, price, discountPrice, isbn, publisher, tags, stock } = req.body;
        
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/books/${req.file.filename}`;
        }

        const book = new Book({
            admin: adminId,
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

        try {
            await book.save();
            res.redirect('/admin/books');
        } catch (error) {
            if (error.code === 11000) { // Duplicate key error
                return res.status(400).json({ 
                    message: 'A book with this title already exists for this admin' 
                });
            }
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error });
    }
};

// Update a book
const updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const adminId =req.user.id;
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
            const book = await Book.findOne({ _id: bookId, admin: adminId });
            if (!book) return res.status(404).json({ message: 'Book not found' });
            
            if (book.image && fs.existsSync(path.join(__dirname, '../../public', book.image))) {
                fs.unlinkSync(path.join(__dirname, '../../public', book.image));
            }
            updateData.image = `/uploads/books/${req.file.filename}`;
        }

        try {
            const updatedBook = await Book.findOneAndUpdate(
                { _id: bookId, admin: adminId },
                updateData,
                { new: true }
            );
            if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
            res.redirect('/admin/books');
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ 
                    message: 'A book with this title already exists for this admin' 
                });
            }
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error });
    }
};

// Delete a book
const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const adminId =req.user.id;
        
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        const book = await Book.findOne({ _id: bookId, admin: adminId });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.image) {
            const imagePath = path.join(__dirname, '../../public', book.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Book.deleteOne({ _id: bookId, admin: adminId });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
};

const getBookById = async (req, res) => {
    try {
        const adminId =req.user.id;
        const book = await Book.findOne({ _id: req.params.id, admin: adminId });
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