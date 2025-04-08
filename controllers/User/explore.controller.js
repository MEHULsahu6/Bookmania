const Book = require('../../models/book.model');
const Wishlist = require('../../models/wishlist.model');

exports.explore = async (req, res) => {
    try {
        const books = await Book.find();
        let wishlistBooks = [];

        if (req.user) {
            const wishlist = await Wishlist.findOne({ user: req.user.id });
            if (wishlist) {
                wishlistBooks = wishlist.books.map(book => book.toString());
            }
        }

        res.render('user/explore', { 
            books,
            wishlistBooks
        });
    } catch (error) {
        console.error('Error loading books:', error);
        res.status(500).send('Server Error');
    }
};
