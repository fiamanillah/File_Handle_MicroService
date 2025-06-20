"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("middlewares/auth");
const router = express_1.default.Router();
// Public route
router.post('/login', authController_1.loginAdmin);
// Protected routes
router.get('/profile', auth_1.authenticateAdmin, authController_1.getAdminProfile);
exports.default = router;
