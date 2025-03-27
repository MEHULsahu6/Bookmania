const AdminProfile = require('../../models/adminProfile.model');
const User = require('../../models/user.model');

const getProfile = async (req, res) => {
    try {
        // Ensure only admins can access
        if (req.user.role !== 'admin') {
            return res.status(403).render('error', { message: 'Unauthorized access' });
        }

        // Fetch user data from JWT payload
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }

        // Fetch admin profile data
        let adminProfile = await AdminProfile.findOne({ admin: req.user.id });
        if (!adminProfile) {
            // Create default profile if none exists
            adminProfile = await AdminProfile.create({
                admin: req.user.id,
                phoneNumber: ''
            });
        }

        res.render('admin/profile', {
            user,
            adminProfile,
            error: null
        });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).render('admin/profile', { 
            user: null, 
            adminProfile: null, 
            error: 'Internal server error' 
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const { fullName, email, phoneNumber, address, city } = req.body;

        // Update User model
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name: fullName, email },
            { new: true, runValidators: true }
        );

        // Update AdminProfile model
        const adminProfile = await AdminProfile.findOneAndUpdate(
            { admin: req.user.id },
            { 
                phoneNumber,
                address, // Added to schema
                city,    // Added to schema
                updatedAt: Date.now() 
            },
            { new: true, runValidators: true, upsert: true }
        );

        res.redirect('/admin/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).render('admin/profile', {
            user: await User.findById(req.user.id),
            adminProfile: await AdminProfile.findOne({ admin: req.user.id }),
            error: 'Failed to update profile'
        });
    }
};

module.exports = {
    getProfile,
    updateProfile
};