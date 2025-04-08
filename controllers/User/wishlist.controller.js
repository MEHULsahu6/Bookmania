const Wishlist = require('../../models/wishlist.model');
const Book = require('../../models/book.model');

exports.wishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id })
            .populate('books');
        
        if (!wishlist) {
            wishlist = { books: [] };
        }
        
        res.render('user/wishlist', { wishlist });
    } catch (error) {
        res.status(500).render('user/wishlist', { error: 'Error loading wishlist' });
    }
};

exports.toggleWishlist = async (req, res) => {
    try {
        const { bookId } = req.body;
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user.id,
                books: [bookId]
            });
            await wishlist.save();
            return res.json({ success: true, message: 'Book added to wishlist' });
        }

        const bookIndex = wishlist.books.indexOf(bookId);
        if (bookIndex > -1) {
            wishlist.books.splice(bookIndex, 1);
            await wishlist.save();
            return res.json({ success: true, message: 'Book removed from wishlist' });
        } else {
            wishlist.books.push(bookId);
            await wishlist.save();
            return res.json({ success: true, message: 'Book added to wishlist' });
        }
    } catch (error) {
        console.error('Wishlist toggle error:', error);
        res.status(500).json({ success: false, message: 'Error updating wishlist' });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { bookId } = req.params;
        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }

        wishlist.books = wishlist.books.filter(book => book.toString() !== bookId);
        await wishlist.save();

        res.json({ success: true, message: 'Book removed from wishlist' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ success: false, message: 'Error removing book from wishlist' });
    }
};