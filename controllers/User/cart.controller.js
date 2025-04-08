const Cart = require('../../models/cart.model');
const Book = require('../../models/book.model');
const User = require('../../models/user.model');
const Order = require('../../models/order.model');

exports.cart = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.redirect('/login');
        }

        const cart = await Cart.findOne({ user: req.user.id })
            .populate({
                path: 'items.book',
                select: 'title price image'
            });
        const user = await User.findById(req.user.id).select('addresses');
        
        res.render('User/cart', { 
            cart: cart || { items: [] }, 
            user,
            error: null 
        });
    } catch (error) {
        console.error('Error loading cart:', error);
        res.status(500).render('User/cart', { 
            cart: { items: [] }, 
            user: null,
            error: 'Error loading cart' 
        });
    }
};

exports.addToCart = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Please login first' });
        }

        const { bookId, quantity = 1 } = req.body;
        if (!bookId) {
            return res.status(400).json({ success: false, message: 'Book ID is required' });
        }

        // Verify book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const existingItem = cart.items.find(item => item.book.toString() === bookId);
        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            cart.items.push({ book: bookId, quantity: parseInt(quantity) });
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

exports.removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item.book.toString() !== bookId);
        await cart.save();

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ success: false, message: 'Error removing item from cart' });
    }
};

exports.placeOrder = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Please login first' });
        }

        const { addressId, paymentMethod } = req.body;
        if (!addressId || !paymentMethod) {
            return res.status(400).json({ success: false, message: 'Address and payment method are required' });
        }

        const cart = await Cart.findOne({ user: req.user.id }).populate('items.book');
        if (!cart || !cart.items.length) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        const user = await User.findById(req.user.id);
        const selectedAddress = user.addresses.find(addr => addr._id.toString() === addressId);
        if (!selectedAddress) {
            return res.status(400).json({ success: false, message: 'Invalid address' });
        }

        // Validate all books exist and have valid prices
        const books = await Promise.all(cart.items.map(async item => {
            const book = await Book.findById(item.book._id);
            if (!book || !book.price) {
                throw new Error(`Invalid book or price for book ID: ${item.book._id}`);
            }
            return {
                book: book._id,
                quantity: item.quantity,
                price: book.price
            };
        }));

        const totalAmount = books.reduce((total, item) => total + (item.price * item.quantity), 0);

        const order = new Order({
            user: req.user.id,
            books,
            totalAmount,
            customerInfo: {
                name: selectedAddress.fullName,
                email: user.email,
                address: {
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    zipCode: selectedAddress.zipCode,
                    phone: selectedAddress.phone
                }
            },
            paymentMethod,
            status: 'pending'
        });

        const savedOrder = await order.save();
        cart.items = [];
        await cart.save();

        res.json({ 
            success: true, 
            orderId: savedOrder._id,
            message: 'Order placed successfully'
        });
    } catch (error) {
        console.error('Place order error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error placing order: ' + (error.message || 'Unknown error')
        });
    }
};

module.exports = exports;