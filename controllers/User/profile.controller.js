const User = require('../../models/user.model');
const UserProfile = require('../../models/userProfile.model');

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let userProfile = await UserProfile.findOne({ user: req.user.id })
            .populate('user', 'name email createdAt');

        if (!userProfile) {
            userProfile = new UserProfile({
                user: req.user.id,
                fullName: user.name,
                email: user.email,
                profilePicture: '/img/profile_default.avif',
                memberSince: user.createdAt
            });
            await userProfile.save();
        }

        // Ensure memberSince is always populated
        if (!userProfile.memberSince && user.createdAt) {
            userProfile.memberSince = user.createdAt;
            await userProfile.save();
        }

        res.render('User/profile', { 
            userProfile: {
                ...userProfile.toObject(),
                memberSince: userProfile.memberSince || user.createdAt
            },
            error: null
        });
    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).render('User/profile', { 
            userProfile: null,
            error: 'Error loading profile'
        });
    }
};

exports.updateField = async (req, res) => {
    try {
        const { field, value } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const userProfile = await UserProfile.findOne({ user: req.user.id }) || new UserProfile({ user: req.user.id });

        if (field === 'phoneNumber') {
            if (!/^\d{10}$/.test(value)) {
                return res.status(400).json({ success: false, error: 'Invalid phone number format' });
            }
            userProfile.phoneNumber = value;
        } else if (field === 'gender') {
            if (!['male', 'female', 'other'].includes(value)) {
                return res.status(400).json({ success: false, error: 'Invalid gender value' });
            }
            userProfile.gender = value;
        } else {
            return res.status(400).json({ success: false, error: 'Invalid field' });
        }

        userProfile.updatedAt = Date.now();
        await userProfile.save();

        res.json({ 
            success: true, 
            message: 'Field updated successfully', 
            data: userProfile 
        });
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error during update' 
        });
    }
};

// Optional: If you need avatar upload functionality
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        const userProfile = await UserProfile.findOne({ user: req.user.id });
        if (!userProfile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        userProfile.profilePicture = `/uploads/${req.file.filename}`;
        await userProfile.save();

        res.json({ 
            success: true, 
            message: 'Avatar updated successfully',
            profilePicture: userProfile.profilePicture 
        });
    } catch (error) {
        console.error('Avatar Upload Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error during avatar upload' 
        });
    }
};