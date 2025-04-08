const multer = require('multer');
const path = require('path');

const createStorage = (folderName) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, `../public/uploads/${folderName}`));
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${folderName}-${uniqueSuffix}${path.extname(file.originalname)}`);
        }
    });
};

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const createUploader = (folderName) => {
    return multer({
        storage: createStorage(folderName),
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB limit
        }
    });
};

module.exports = {
    userProfileUpload: createUploader('user_profiles'),
    adminProfileUpload: createUploader('admin_profiles')
};