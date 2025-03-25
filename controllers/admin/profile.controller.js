const AdminProfile = require('../../models/adminProfile.model');
const User = require('../../models/user.model');

const getProfile = async (req, res) => {
    res.render('admin/profile');
};

module.exports = {
    getProfile
};