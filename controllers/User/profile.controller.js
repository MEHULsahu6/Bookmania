const UserProfile = require('../../models/userProfile.model');
const User = require('../../models/user.model');

exports.profile = async (req, res) => {
    try {
        const userProfile = await UserProfile.findOne({ user: req.user._id })
            .populate('user')
            .populate('orderHistory');
        res.render('User/profile', { userProfile });
    } catch (error) {
        res.status(500).render('User/profile', { error: 'Error loading profile' });
    }
};