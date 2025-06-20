"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp',
    'image/tiff',
    'image/bmp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/rtf',
    'application/epub+zip',
    // Archives & Compressed
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/webm',
    'audio/x-m4a',
    // Video
    'video/mp4',
    'video/x-msvideo',
    'video/quicktime',
    'video/x-matroska',
    'video/webm',
    'video/x-flv',
    'video/3gpp',
    // Code & Scripts
    'text/html',
    'text/css',
    'application/javascript',
    'application/json',
    'application/xml',
    'text/x-python',
    'text/x-java-source',
    'text/x-c',
    // Executables & System Files
    'application/x-msdownload',
    'application/x-sh',
    'application/x-apple-diskimage',
    'application/vnd.debian.binary-package',
    'application/x-rpm',
    // Database & Data
    'application/x-sql',
    'application/x-dbf',
    'application/vnd.ms-access',
    'application/x-sqlite3',
];
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type. Only the following types are allowed: ${allowedMimeTypes.join(', ')}`));
    }
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Convert to absolute path for reliability
        const uploadsDir = process.env.EXTERNAL_UPLOADS_DIR
            ? path_1.default.resolve(process.env.EXTERNAL_UPLOADS_DIR)
            : path_1.default.join(process.cwd(), 'uploads');
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Better filename handling with proper extension
        const fileExt = path_1.default.extname(file.originalname);
        // const baseName = path.basename(file.originalname, fileExt);
        const uniqueName = `${(0, uuid_1.v4)()}-${Date.now()}${fileExt}`;
        cb(null, uniqueName);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        files: 10, // Maximum 5 files
    },
});
