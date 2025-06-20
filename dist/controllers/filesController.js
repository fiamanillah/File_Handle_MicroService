"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFile = void 0;
const File_1 = __importDefault(require("@models/File"));
const fs_1 = __importDefault(require("fs"));
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Handle both single file and multiple files cases
        let files;
        if (Array.isArray(req.files)) {
            files = req.files;
        }
        else {
            // If not array, it's an object with fieldname keys
            files = Object.values(req.files).flat();
        }
        if (files.length === 0) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000/'}`;
        // Save file metadata to the database
        const filesData = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const newFile = yield File_1.default.create({
                url: baseUrl + file.filename,
                path: file.path,
                size: file.size,
                originalname: file.originalname,
                filename: file.filename,
                mimetype: file.mimetype,
            });
            return newFile;
        })));
        res.json({
            message: 'Files uploaded successfully',
            files: filesData,
        });
    }
    catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
});
exports.uploadFile = uploadFile;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const file = yield File_1.default.findByIdAndDelete(id);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        fs_1.default.unlink(file.path, (err) => {
            if (err) {
                console.error('Error deleting file from filesystem:', err);
                return res
                    .status(500)
                    .json({ error: 'Failed to delete file from filesystem' });
            }
        });
        res.json({ message: 'File deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});
exports.deleteFile = deleteFile;
