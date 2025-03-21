const AdminProfile = require('../../models/adminProfile.model');
const User = require('../../models/user.model');

const getProfile = async (req, res) => {
    try {
        const adminProfile = await AdminProfile.findOne({ admin: req.user._id })
            .populate('admin');
        res.render('admin/profile', { adminProfile });
    } catch (error) {
        res.status(500).render('admin/profile', { error: 'Error loading profile' });
    }
};

module.exports = {
    getProfile
};