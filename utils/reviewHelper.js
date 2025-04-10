const Review = require('../models/review.model');

const getBookReviews = async (bookId) => {
    try {
        // Get rating statistics
        const ratingStats = await Review.calculateBookRating(bookId);

        // Get recent reviews
        const reviews = await Review.find({ 
            book: bookId, 
            status: 'approved' 
        })
        .populate('user', 'name profilePicture')
        .sort({ createdAt: -1 })
        .limit(5);

        return {
            stats: ratingStats,
            recentReviews: reviews
        };
    } catch (error) {
        console.error('Error calculating reviews:', error);
        return null;
    }
};

module.exports = { getBookReviews };