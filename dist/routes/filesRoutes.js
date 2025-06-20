"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("@config/multer");
const filesController_1 = require("@controllers/filesController");
const express_1 = require("express");
const apiKeyAuth_1 = require("middlewares/apiKeyAuth");
const router = (0, express_1.Router)();
router.post('/upload', (0, apiKeyAuth_1.requireApiKey)(), multer_1.upload.array('files', 10), // Allow up to 10 files
filesController_1.uploadFile);
router.delete('/delete/:id', (0, apiKeyAuth_1.requireApiKey)(), filesController_1.deleteFile);
exports.default = router;
