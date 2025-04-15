// src/middleware/uploadAudio.ts
import multer from 'multer';
import path from 'path';

// Only accept audio files (like mp3, wav, webm, etc.)
const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    const filetypes = /mp3|wav|webm|ogg|m4a/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only audio files are allowed!'));
    }
};

const uploadAudio = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB max
    },
});

export default uploadAudio;
