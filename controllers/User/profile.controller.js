const User = require('../../models/user.model');
const UserProfile = require('../../models/userProfile.model');
const path = require('path');
const fs = require('fs');
const Order = require('../../models/order.model');
const Review = require('../../models/review.model');

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let userProfile = await UserProfile.findOne({ user: req.user.id })
            .populate('user', 'name email createdAt');

        if (!userProfile) {
            const newProfile = new UserProfile({
                user: req.user.id,
                fullName: req.user.name,
                email: req.user.email
            });
            await newProfile.save();
            
            return res.render('User/profile', { 
                userProfile: newProfile,
                user: req.user,
                error: null 
            });
        }

        // Get shipped orders with books
        const shippedOrders = await Order.find({
            user: req.user.id,
            status: 'shipped'
        }).populate('books.book');

        // Get existing reviews
        const existingReviews = await Review.find({
            user: req.user.id
        }).select('book rating');

        const reviewedBooks = new Set(existingReviews.map(review => review.book.toString()));

        res.render('User/profile', { 
            userProfile,
            shippedOrders,
            reviewedBooks,
            error: null
        });
    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).render('User/profile', { 
            userProfile: null,
            shippedOrders: [],
            reviewedBooks: new Set(),
            error: 'Error loading profile'
        });
    }
};

exports.updateField = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { field, value } = req.body;
        if (!field || !value) {
            return res.status(400).json({ error: 'Field and value are required' });
        }

        let userProfile = await UserProfile.findOne({ user: req.user.id });
        
        if (!userProfile) {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            userProfile = new UserProfile({
                user: req.user.id,
                fullName: user.name,
                email: user.email
            });
        }

        if (field === 'phoneNumber' && !/^\d{10}$/.test(value)) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        if (field === 'gender' && !['male', 'female', 'other'].includes(value)) {
            return res.status(400).json({ error: 'Invalid gender value' });
        }

        userProfile[field] = value;
        userProfile.updatedAt = Date.now();
        await userProfile.save();

        res.status(200).json({ success: true, message: `${field} updated successfully` });
    } catch (error) {
        console.error('Update Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error during update'
        });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        let userProfile = await UserProfile.findOne({ user: req.user.id });
        
        if (!userProfile) {
            const user = await User.findById(req.user.id);
            userProfile = new UserProfile({
                user: req.user.id,
                fullName: user.name,
                email: user.email
            });
        }

        // Delete old profile picture if it exists and isn't the default
        if (userProfile.profilePicture && 
            userProfile.profilePicture !== '../../img/profile_default.avif') {
            const oldImagePath = path.join(__dirname, '../../public', userProfile.profilePicture);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Save new profile picture path
        userProfile.profilePicture = `/uploads/user_profiles/${req.file.filename}`;
        userProfile.updatedAt = Date.now();
        await userProfile.save();

        res.json({ 
            success: true, 
            message: 'Avatar updated successfully',
            profilePicture: userProfile.profilePicture 
        });
    } catch (error) {
        console.error('Avatar Upload Error:', error);
        // Remove uploaded file if save fails
        if (req.file) {
            const filePath = path.join(__dirname, '../../public/uploads/user_profiles', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Server error during avatar upload'
        });
    }
};