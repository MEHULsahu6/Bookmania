const UserProfile = require('../../models/userProfile.model');
const User = require('../../models/user.model');

exports.profile = async (req, res) => {
    try {
        const userProfile = await UserProfile.findOne({ user: req.user.id })
            .populate('user', '-password')  // Exclude password
            .populate('orderHistory');
            
        if (!userProfile) {
            return res.status(404).render('User/profile', { error: 'Profile not found' });
        }

        res.render('User/profile', { 
            userProfile,
            user: userProfile.user,
            error: null 
        });
    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).render('User/profile', { error: 'Error loading profile' });
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