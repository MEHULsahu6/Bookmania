const Book = require('../../models/book.model');
const Wishlist = require('../../models/wishlist.model');
const { getBookReviews } = require('../../utils/reviewHelper');

exports.explore = async (req, res) => {
    try {
        const books = await Book.find();
        
        // Get the user's wishlist
        const wishlist = await Wishlist.findOne({ user: req.user?.id });
        const wishlistBooks = wishlist ? wishlist.books.map(id => id.toString()) : [];
        
        // Get reviews for each book
        const booksWithReviews = await Promise.all(books.map(async (book) => {
            const reviews = await getBookReviews(book._id);
            return {
                ...book.toObject(),
                id: book._id, // Add this line to ensure 'id' is available
                reviews: reviews?.stats || { averageRating: 0, totalReviews: 0 }
            };
        }));

        res.render('User/explore', { 
            books: booksWithReviews,
            wishlistBooks,
            user: req.user 
        });
    } catch (error) {
        console.error('Error loading books:', error);
        res.status(500).render('User/explore', { 
            books: [],
            wishlistBooks: [],
            error: 'Error loading books'
        });
    }
};
