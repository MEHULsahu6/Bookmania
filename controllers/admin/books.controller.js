const Book = require('../../models/book.model');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const getBooks = async (req, res) => {
    try {
        const adminId = req.user.id;
        const books = await Book.find({ admin: adminId });
        res.render('admin/books', { books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).render('admin/books', { 
            books: [],
            error: 'Error fetching books'
        });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, author, price, description, category } = req.body;
        const coverImage = req.file ? `/uploads/books/${req.file.filename}` : null;

        const book = new Book({
            title,
            author,
            price,
            description,
            category,
            image: coverImage,
            admin: req.user.id
        });

        await book.save();
        req.flash('success_msg', 'Book added successfully');
        res.redirect('/admin/books');
    } catch (error) {
        console.error('Error creating book:', error);
        req.flash('error_msg', 'Failed to add book');
        res.redirect('/admin/books');
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
            req.flash('success_msg', 'Book updated successfully');
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
        req.flash('success_msg', 'Book deleted successfully');
        res.json({ success: true });
    } catch (error) {
        req.flash('error_msg', 'Failed to delete book');
        res.status(500).json({ success: false });
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