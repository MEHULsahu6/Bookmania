const Book = require('../../models/book.model');

exports.explore = async (req, res) => {
    try {
        const books = await Book.find(); // Fetch all books
        res.render('User/explore', { books }); // Pass books to the view
    } catch (error) {
        console.error('Error loading books:', error);
        res.status(500).send('Server Error');
    }
};
