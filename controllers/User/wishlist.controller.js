const Wishlist = require('../../models/wishlist.model');
const Book = require('../../models/book.model');

exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id })
            .populate('books');
        
        if (!wishlist) {
            wishlist = { books: [] };
        }
        
        res.render('user/wishlist', { wishlist });
    } catch (error) {
        console.error('Error loading wishlist:', error);
        res.status(500).render('user/wishlist', { 
            wishlist: { books: [] }, 
            error: 'Error loading wishlist' 
        });
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
            return res.json({ 
                success: true, 
                message: 'Book added to wishlist',
                isAdded: true 
            });
        }

        const bookIndex = wishlist.books.indexOf(bookId);
        let isAdded;
        
        if (bookIndex > -1) {
            wishlist.books.splice(bookIndex, 1);
            isAdded = false;
        } else {
            wishlist.books.push(bookId);
            isAdded = true;
        }
        
        await wishlist.save();
        return res.json({ 
            success: true, 
            message: isAdded ? 'Book added to wishlist' : 'Book removed from wishlist',
            isAdded 
        });
    } catch (error) {
        console.error('Wishlist toggle error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating wishlist' 
        });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { bookId } = req.params;
        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(404).json({ 
                success: false, 
                message: 'Wishlist not found' 
            });
        }

        wishlist.books = wishlist.books.filter(book => book.toString() !== bookId);
        await wishlist.save();

        res.json({ 
            success: true, 
            message: 'Book removed from wishlist' 
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error removing book from wishlist' 
        });
    }
};

exports.getExplore = async (req, res) => {
    try {
        const books = await Book.find();
        const wishlist = await Wishlist.findOne({ user: req.user.id });
        const wishlistBooks = wishlist ? wishlist.books.map(id => id.toString()) : [];
        
        res.render('user/explore', {
            books,
            wishlistBooks,
            user: req.user
        });
    } catch (error) {
        console.error('Error loading explore page:', error);
        res.status(500).render('user/explore', {
            books: [],
            wishlistBooks: [],
            error: 'Error loading books'
        });
    }
};