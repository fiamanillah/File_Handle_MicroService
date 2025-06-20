"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyModel = void 0;
// src/models/ApiKey.ts
const mongoose_1 = require("mongoose");
const ApiKeySchema = new mongoose_1.Schema({
    serviceName: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    permissions: { type: [String], required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});
exports.ApiKeyModel = (0, mongoose_1.model)('ApiKey', ApiKeySchema);
