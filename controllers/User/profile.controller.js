const UserProfile = require('../../models/userProfile.model');
const User = require('../../models/user.model');

exports.profile = async (req, res) => {
    try {
        const userProfile = await UserProfile.findOne({ user: req.user.id })
            .populate('user', '-password')  // Exclude password
            .populate('orderHistory');
            
        if (!userProfile) {
            // Create a new profile with basic information
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

        res.render('User/profile', { 
            userProfile,
            user: userProfile.user,
            error: null 
        });
    } catch (error) {
        console.error('Profile Error:', error);
        // Provide default values when there's an error
        res.status(500).render('User/profile', { 
            userProfile: {
                fullName: req.user.name,
                email: req.user.email,
                phoneNumber: '',
                gender: '',
                memberSince: new Date()
            },
            user: req.user,
            error: 'Error loading profile' 
        });
    }
};

exports.updatePhone = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { phoneNumber } = req.body;
        if (!phoneNumber || phoneNumber.length < 10) {
            return res.status(400).json({ error: 'Invalid phone number' });
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
                email: user.email,
                phoneNumber
            });
        } else {
            userProfile.phoneNumber = phoneNumber;
        }
        
        await userProfile.save();
        res.status(200).json({ success: true, message: 'Phone number updated successfully' });
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