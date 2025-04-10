const Review = require('../../models/review.model');

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email profilePicture')
            .populate('book', 'title image')
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

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: 'Review not found' 
            });
        }

        res.json({ success: true, review });
    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating review status' 
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        await Review.findByIdAndDelete(reviewId);
        
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting review' 
        });
    }
};

module.exports = {
    getReviews,
    updateReviewStatus,
    deleteReview
};