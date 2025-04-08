const User = require('../../models/user.model');
const UserProfile = require('../../models/userProfile.model');

exports.profile = async (req, res) => {
    try {
        // First get the user data
        const user = await User.findById(req.user.id).select('-password');
        
        // Find or create user profile
        let userProfile = await UserProfile.findOne({ user: req.user.id });

        if (!userProfile) {
            // Create a new profile if it doesn't exist
            userProfile = new UserProfile({
                user: req.user.id,
                fullName: user.name,
                email: user.email,
                phoneNumber: null,
                gender: null,
                profilePicture: '/img/profile_default.avif'
            });
            await userProfile.save();
        }

        // Render with safe fallback values
        res.render('User/profile', { 
            userProfile: {
                ...userProfile.toObject(),
                user: user,
                memberSince: user.createdAt
            },
            error: null 
        });
    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).render('User/profile', { 
            userProfile: {
                fullName: req.user?.name || 'User',
                email: req.user?.email || '',
                phoneNumber: null,
                gender: null,
                profilePicture: '/img/profile_default.avif',
                user: req.user,
                memberSince: new Date()
            },
            error: 'Error loading profile' 
        });
    }
};

exports.updatePhone = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        let userProfile = await UserProfile.findOne({ user: req.user.id });
        
        if (!userProfile) {
            // Create new profile if it doesn't exist
            userProfile = new UserProfile({
                user: req.user.id,
                fullName: req.user.name,
                email: req.user.email,
                phoneNumber
            });
        } else {
            userProfile.phoneNumber = phoneNumber;
        }
        
        await userProfile.save();
        res.redirect('/profile');
    } catch (error) {
        console.error('Update Phone Error:', error);
        res.status(500).json({ error: 'Error updating phone number' });
    }
};

exports.updateGender = async (req, res) => {
    try {
        const { gender } = req.body;
        let userProfile = await UserProfile.findOne({ user: req.user.id });
        
        if (!userProfile) {
            // Create new profile if it doesn't exist
            userProfile = new UserProfile({
                user: req.user.id,
                fullName: req.user.name,
                email: req.user.email,
                gender
            });
        } else {
            userProfile.gender = gender;
        }
        
        await userProfile.save();
        res.redirect('/profile');
    } catch (error) {
        console.error('Update Gender Error:', error);
        res.status(500).json({ error: 'Error updating gender' });
    }
};