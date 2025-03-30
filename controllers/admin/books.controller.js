const Book = require('../../models/book.model');
// Remove this line
const path = require('path');
const fs = require('fs');

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
        
        // Handle file upload
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/books/${req.file.filename}`;
        }

        // In createBook function, modify the book creation:
        const book = new Book({
            title,
            author,
            description,
            price,
            discountPrice: discountPrice || null,
            isbn: isbn || null,
            publisher: publisher || null,
            tags, // Now tags will be an array from multiple select
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
        
        // In updateBook function, modify updateData:
        const updateData = {
            title,
            author,
            description,
            price,
            discountPrice: discountPrice || null,
            isbn: isbn || null,
            publisher: publisher || null,
            tags, // Now tags will be an array from multiple select
            stock
        };

        if (req.file) {
            // Delete old image if exists
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
        const book = await Book.findById(bookId);
        
        if (book.image && fs.existsSync(path.join(__dirname, '../../public', book.image))) {
            fs.unlinkSync(path.join(__dirname, '../../public', book.image));
        }

        await Book.findByIdAndDelete(bookId);
        res.redirect('/admin/books');
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
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
    getBookById // Add this
};
