const Cart = require('../../models/cart.model');
const Book = require('../../models/book.model');
const User = require('../../models/user.model');
exports.cart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.book');
        const user = await User.findById(req.user.id).select('addresses');
        res.render('User/cart', { cart, user });
    } catch (error) {
        console.error('Error loading cart:', error);
        res.status(500).render('User/cart', { error: 'Error loading cart' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.book.toString() === bookId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ book: bookId, quantity: 1 });
        }

        await cart.save();
        res.json({ success: true, message: 'Item added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, message: 'Error adding item to cart' });
    }
};

exports.saveAddress = async (req, res) => {
    try {
        const { fullName, street, city, state, zipCode, phone } = req.body;
        const user = await User.findById(req.user.id);
        
        const newAddress = {
            fullName,
            street,
            city,
            state,
            zipCode,
            phone
        };

        if (user.addresses.length === 0) {
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();
        
        res.json({ success: true, message: 'Address saved successfully' });
    } catch (error) {
        console.error('Save address error:', error);
        res.status(500).json({ success: false, message: 'Error saving address' });
    }
};

module.exports = exports;