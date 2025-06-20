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
exports.AdminModel = void 0;
exports.initializeDefaultAdmin = initializeDefaultAdmin;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: { type: Date },
}, {
    timestamps: true,
});
// Hash password before saving
AdminSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, 12);
        next();
    });
});
// Password comparison method
AdminSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.compare(candidatePassword, this.password);
    });
};
exports.AdminModel = (0, mongoose_1.model)('Admin', AdminSchema);
// Initialize default admin if not exists
function initializeDefaultAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultAdmin = {
            username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
            password: process.env.DEFAULT_ADMIN_PASSWORD || 'securepassword123',
        };
        const existingAdmin = yield exports.AdminModel.findOne({
            username: defaultAdmin.username,
        });
        if (!existingAdmin) {
            yield exports.AdminModel.create(defaultAdmin);
            console.log('Default admin account created');
        }
    });
}
