const Review = require('../../models/review.model');
const Book = require('../../models/book.model');

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email profilePicture')
            .populate('book', 'title image')
            .populate('order', 'orderId orderDate')
            .sort({ createdAt: -1 });

        res.render('admin/reviews', { reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.render('admin/reviews', { 
            reviews: [],
            error: 'Error fetching reviews' 
        });
    }
};

const updateReviewStatus = async (req, res) => {
    try {
        const { reviewId, status } = req.body;
        const review = await Review.findByIdAndUpdate(
            reviewId,
            { status },
            { new: true }
        );

        res.json({ success: true, review });
    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating review status' 
        });
    }
};

module.exports = {
    getReviews,
    updateReviewStatus
};