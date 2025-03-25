const AdminProfile = require('../../models/adminProfile.model');
const User = require('../../models/user.model');

const getProfile = async (req, res) => {
    try {
        const adminProfile = await AdminProfile.findOne({ admin: req.user._id })
            .populate('admin');
            
        if (!adminProfile) {
            // If no profile exists, create a default one
            const newAdminProfile = new AdminProfile({
                admin: req.user._id,
                phoneNumber: '', // Default empty phone number
            });
            await newAdminProfile.save();
            
            // Fetch the newly created profile with populated admin data
            const populatedProfile = await AdminProfile.findOne({ admin: req.user._id })
                .populate('admin');
                
            return res.render('admin/profile', { adminProfile: populatedProfile });
        }
        
        res.render('admin/profile', { adminProfile });
    } catch (error) {
        console.error('Profile Error:', error);
        // Always pass adminProfile, even if it's null
        res.render('admin/profile', { adminProfile: null, error: 'Error loading profile' });
    }
};

// Add new updateProfile function
const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, currentPassword, newPassword } = req.body;

        // Update user information
        const user = await User.findById(req.user._id);
        if (currentPassword && newPassword) {
            // Verify current password
            const isValidPassword = await user.comparePassword(currentPassword);
            if (!isValidPassword) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }
            user.password = newPassword;
        }
        user.name = fullName;
        user.email = email;
        await user.save();

        // Update admin profile
        const adminProfile = await AdminProfile.findOne({ admin: req.user._id });
        adminProfile.phoneNumber = phoneNumber;
        adminProfile.updatedAt = Date.now();
        await adminProfile.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    }
};

module.exports = {
    getProfile,
    updateProfile
};