const AdminProfile = require('../../models/adminProfile.model');
const User = require('../../models/user.model');
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/admin_profiles'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only JPEG and PNG images are allowed'));
};

// Multer instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
}).single('profilePicture'); // Field name in form


const getProfile = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).render('error', { message: 'Unauthorized access' });
        }

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }

        const adminProfile = await AdminProfile.findOne({ admin: req.user.id });

        res.render('admin/profile', {
            user,
            adminProfile: adminProfile || null, // Pass null if no profile exists
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
    upload(req, res, async (err) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized access' });
            }

            if (err instanceof multer.MulterError) {
                return res.status(400).render('admin/profile', {
                    user: await User.findById(req.user.id),
                    adminProfile: await AdminProfile.findOne({ admin: req.user.id }),
                    error: 'File upload error: ' + err.message
                });
            } else if (err) {
                return res.status(400).render('admin/profile', {
                    user: await User.findById(req.user.id),
                    adminProfile: await AdminProfile.findOne({ admin: req.user.id }),
                    error: err.message
                });
            }

            const { fullName, email, phoneNumber, address, city } = req.body;

            // Update User model
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { name: fullName, email },
                { new: true, runValidators: true }
            );

            // Prepare update object for AdminProfile
            const updateData = { 
                phoneNumber,
                address,
                city,
                updatedAt: Date.now() 
            };

            if (req.file) {
                updateData.profilePicture = `/uploads/admin_profiles/${req.file.filename}`;
            }

            // Update or create AdminProfile
            let adminProfile = await AdminProfile.findOne({ admin: req.user.id });
            if (adminProfile) {
                adminProfile = await AdminProfile.findOneAndUpdate(
                    { admin: req.user.id },
                    updateData,
                    { new: true, runValidators: true }
                );
            } else {
                updateData.admin = req.user.id; // Add admin field for new profile
                adminProfile = await AdminProfile.create(updateData);
            }

            res.redirect('/admin/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).render('admin/profile', {
                user: await User.findById(req.user.id),
                adminProfile: await AdminProfile.findOne({ admin: req.user.id }),
                error: 'Failed to update profile: ' + error.message
            });
        }
    });
};

module.exports = {
    getProfile,
    updateProfile
};