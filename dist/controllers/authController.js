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
exports.getAdminProfile = exports.loginAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../models/Admin");
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Find admin
        const admin = yield Admin_1.AdminModel.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Check password
        const isMatch = yield admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Update last login
        admin.lastLogin = new Date();
        yield admin.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            username: admin.username,
            expiresIn: 3600, // 1 hour in seconds
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.loginAdmin = loginAdmin;
const getAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    res.json({
        username: (_a = req.admin) === null || _a === void 0 ? void 0 : _a.username,
        message: 'Authenticated as admin',
    });
});
exports.getAdminProfile = getAdminProfile;
