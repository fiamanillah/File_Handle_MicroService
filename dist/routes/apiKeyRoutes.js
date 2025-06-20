"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/apiKeyRoutes.ts
const apiKeyController_1 = require("@controllers/apiKeyController");
const express_1 = __importDefault(require("express"));
const auth_1 = require("middlewares/auth");
const router = express_1.default.Router();
// Generate new API key (protected by admin auth)
router.post('/', auth_1.authenticateAdmin, apiKeyController_1.generateApiKey);
// Revoke an API key
router.delete('/:key', auth_1.authenticateAdmin, apiKeyController_1.revokeApiKey);
exports.default = router;
