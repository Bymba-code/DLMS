const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Зургийн файл filter
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Зөвхөн зураг файл оруулна уу! (jpeg, jpg, png, gif, webp)'));
    }
};

// Video файл filter
const videoFileFilter = (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Зөвхөн video файл оруулна уу! (mp4, mov, avi, mkv, webm)'));
    }
};

// Chunk upload-д зориулсан filter (бүх төрлийн файл зөвшөөрнө)
const chunkFileFilter = (req, file, cb) => {
    // Chunk upload үед бүх файлыг зөвшөөрнө
    cb(null, true);
};

// Зургийн upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter
});

// Video chunk upload
const uploadChunk = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB chunk size
    fileFilter: chunkFileFilter
});

// Video file upload (chunk биш)
const uploadVideo = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    fileFilter: videoFileFilter
});

// Зураг устгах функц
const deleteImage = (imagePath) => {
    try {
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            return true;
        }
        return false;
    } catch (err) {
        console.error('Зураг устгахад алдаа гарлаа:', err);
        return false;
    }
};

module.exports = {
    upload,          // Зургийн upload
    uploadChunk,     // Chunk upload
    uploadVideo,     // Video upload
    deleteImage
};