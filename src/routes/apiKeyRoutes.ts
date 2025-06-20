// src/routes/apiKeyRoutes.ts
import { generateApiKey, revokeApiKey } from '@controllers/apiKeyController';
import express from 'express';
import { authenticateAdmin } from 'middlewares/auth';

const router = express.Router();

router.get('/', authenticateAdmin);

// Generate new API key (protected by admin auth)
router.post('/', authenticateAdmin, generateApiKey);

// Revoke an API key
router.delete('/:key', authenticateAdmin, revokeApiKey);

export default router;
