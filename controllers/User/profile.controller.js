const User = require('../../models/user.model');
const UserProfile = require('../../models/userProfile.model');

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let userProfile = await UserProfile.findOne({ user: req.user.id }).populate({
            path: 'user',
            select: 'name email createdAt'
        });

        if (!userProfile) {
            userProfile = new UserProfile({ user: user.id });
            await userProfile.save();
            await userProfile.populate('user');
        }

        res.render('User/profile', { userProfile, error: null });
    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).render('User/profile', { userProfile: null, error: 'Error loading profile' });
    }
};

exports.updateField = async (req, res) => {
    try {
        const { field, value } = req.body;
        console.log('Received update:', { field, value });

        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const userProfile = await UserProfile.findOne({ user: req.user.id }) || new UserProfile({ user: req.user.id });

        if (field === 'phoneNumber') {
            userProfile.phoneNumber = value;
        } else if (field === 'gender') {
            if (['male', 'female', 'other'].includes(value)) {
                userProfile.gender = value;
            } else {
                return res.status(400).json({ success: false, error: 'Invalid gender value' });
            }
        } else {
            return res.status(400).json({ success: false, error: 'Invalid field' });
        }

        await userProfile.save();
        console.log('Profile updated:', userProfile);

        res.json({ success: true, message: 'Field updated successfully', data: userProfile });
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ success: false, error: 'Server error during update' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        let userProfile = await UserProfile.findOne({ user: req.user.id });
        
        if (!userProfile) {
            userProfile = new UserProfile({
                user: req.user.id
            });
        }

        // Handle both single field update and multiple field updates
        if (updates.field && updates.value) {
            // Single field update
            if (updates.field === 'phoneNumber' || updates.field === 'gender') {
                userProfile[updates.field] = updates.value;
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid field'
                });
            }
        } else {
            // Multiple field updates
            const allowedFields = ['phoneNumber', 'gender'];
            Object.keys(updates).forEach(key => {
                if (allowedFields.includes(key)) {
                    userProfile[key] = updates[key];
                }
            });
        }

        userProfile.updatedAt = Date.now();
        await userProfile.save();
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: userProfile
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update profile'
        });
    }
};