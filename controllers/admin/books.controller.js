const Book = require('../../models/book.model');
const Category = require('../../models/category.model');

const getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        const categories = await Category.find();
        res.render('admin/books', { books, categories });
    } catch (error) {
        res.status(500).render('admin/books', { error: 'Error loading books' });
    }
};

module.exports = {
    getBooks
};