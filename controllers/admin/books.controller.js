const Book = require('../../models/book.model');
const Category = require('../../models/category.model');

const getBooks = async (req, res) => {
    res.render('admin/books');
};

module.exports = {
    getBooks
};