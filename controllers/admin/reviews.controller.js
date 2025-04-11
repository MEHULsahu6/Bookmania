const Review = require('../../models/review.model');
const Book = require('../../models/book.model');

const getReviews = async (req, res) => {
    try {
        const adminId = req.user.id;
        
        // Get books belonging to this admin
        const adminBooks = await Book.find({ admin: adminId }).select('_id');
        const adminBookIds = adminBooks.map(book => book._id);

        // Get reviews for admin's books
        const reviews = await Review.find({
            book: { $in: adminBookIds }
        })
        .populate('user', 'name email')
        .populate('book', 'title image')
        .sort({ createdAt: -1 });

        res.render('admin/reviews', { reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).render('admin/reviews', { 
            reviews: [],
            error: 'Error fetching reviews'
        });
    }
};

module.exports = {
    getReviews
};