const Review = require('../../models/review.model');
const Book = require('../../models/book.model');

const getReviews = async (req, res) => {
    try {
        const adminId = req.user.id;
        
        const reviews = await Review.find({
            book: { 
                $in: await Book.find({ admin: adminId }).distinct('_id') 
            }
        })
        .populate('user', 'name email')
        .populate('book', 'title');

        res.render('admin/reviews', { reviews });
    } catch (error) {
        res.status(500).render('error', { message: 'Error fetching reviews' });
    }
};

const respondToReview = async (req, res) => {
    try {
        const { reviewId, response } = req.body;
        const review = await Review.findById(reviewId);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.adminResponse = response;
        review.adminResponseDate = Date.now();
        await review.save();

        res.json({ success: true, message: 'Response added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error responding to review', error });
    }
};

module.exports = {
    getReviews,
    respondToReview
};