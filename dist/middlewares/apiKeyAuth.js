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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireApiKey = requireApiKey;
const ApiKey_1 = require("../models/ApiKey");
function requireApiKey(requiredPermission) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        // 1. Get API key from header
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.status(401).json({ error: 'API key missing' });
        }
        // 2. Check if key exists in DB
        const keyData = yield ApiKey_1.ApiKeyModel.findOne({ key: apiKey });
        if (!keyData || !keyData.isActive) {
            return res.status(403).json({ error: 'Invalid API key' });
        }
        // 3. Check permissions (if required)
        if (requiredPermission &&
            !keyData.permissions.includes(requiredPermission)) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        next(); // Proceed to the route handler
    });
}
