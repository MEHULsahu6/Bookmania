const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
reviewSchema.index({ book: 1, status: 1 });
reviewSchema.index({ order: 1, book: 1 });

// Static method to calculate book rating
reviewSchema.statics.calculateBookRating = async function(bookId) {
    const result = await this.aggregate([
        {
            $match: {
                book: new mongoose.Types.ObjectId(bookId),
                status: 'approved'
            }
        },
        {
            $group: {
                _id: '$book',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
                ratingCounts: {
                    $push: '$rating'
                }
            }
        }
    ]);

    if (result.length > 0) {
        const ratings = result[0].ratingCounts;
        const ratingDistribution = {
            5: ratings.filter(r => r === 5).length,
            4: ratings.filter(r => r === 4).length,
            3: ratings.filter(r => r === 3).length,
            2: ratings.filter(r => r === 2).length,
            1: ratings.filter(r => r === 1).length
        };

        return {
            averageRating: Math.round(result[0].averageRating * 10) / 10,
            totalReviews: result[0].totalReviews,
            ratingDistribution
        };
    }

    return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
};

module.exports = mongoose.model('Review', reviewSchema);