import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

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

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only the following types are allowed: ${allowedMimeTypes.join(', ')}`,
      ),
    );
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Convert to absolute path for reliability
    const uploadsDir = process.env.EXTERNAL_UPLOADS_DIR
      ? path.resolve(process.env.EXTERNAL_UPLOADS_DIR)
      : path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Better filename handling with proper extension
    const fileExt = path.extname(file.originalname);
    // const baseName = path.basename(file.originalname, fileExt);
    const uniqueName = `${uuid()}-${Date.now()}${fileExt}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files
  },
});
