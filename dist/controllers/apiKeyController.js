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
exports.revokeApiKey = exports.generateApiKey = void 0;
const ApiKey_1 = require("../models/ApiKey");
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("@utils/logger");
const generateApiKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceName, permissions } = req.body;
        if (!serviceName || !permissions || !Array.isArray(permissions)) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        const key = `sk_${crypto_1.default.randomBytes(16).toString('hex')}`; // Generate a random key
        const newApiKey = yield ApiKey_1.ApiKeyModel.create({
            serviceName,
            key,
            permissions,
            isActive: true,
        });
        if (!newApiKey) {
            return res.status(500).json({ error: 'Failed to create API key' });
        }
        // Return the generated key
        logger_1.logger.info(`Generated API key for service: ${serviceName}`, {
            serviceName,
            permissions,
            key: newApiKey.key,
        });
        res.status(201).json({ key: newApiKey.key, serviceName, permissions });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.generateApiKey = generateApiKey;
const revokeApiKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key } = req.params;
        const updated = yield ApiKey_1.ApiKeyModel.findOneAndUpdate({ key }, { isActive: false }, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 'API key not found' });
        }
        res.json({ message: 'API key revoked', key: updated.key });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.revokeApiKey = revokeApiKey;
