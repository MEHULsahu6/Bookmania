const Book = require('../../models/book.model');
const { getBookReviews } = require('../../utils/reviewHelper');

exports.explore = async (req, res) => {
    try {
        const books = await Book.find();
        
        // Get reviews for each book
        const booksWithReviews = await Promise.all(books.map(async (book) => {
            const reviews = await getBookReviews(book._id);
            return {
                ...book.toObject(),
                reviews: reviews?.stats || { averageRating: 0, totalReviews: 0 }
            };
        }));

        res.render('User/explore', { 
            books: booksWithReviews,
            user: req.user 
        });
    } catch (error) {
        console.error('Error loading books:', error);
        res.status(500).render('User/explore', { 
            books: [],
            error: 'Error loading books'
        });
    }
};
