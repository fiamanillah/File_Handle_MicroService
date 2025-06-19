// src/middleware/apiKeyAuth.ts
import { Request, Response, NextFunction } from 'express';
import { ApiKeyModel } from '../models/ApiKey';

export function requireApiKey(requiredPermission?: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get API key from header
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      return res.status(401).json({ error: 'API key missing' });
    }

    // 2. Check if key exists in DB
    const keyData = await ApiKeyModel.findOne({ key: apiKey });

    if (!keyData || !keyData.isActive) {
      return res.status(403).json({ error: 'Invalid API key' });
    }

    // 3. Check permissions (if required)
    if (
      requiredPermission &&
      !keyData.permissions.includes(requiredPermission)
    ) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    next(); // Proceed to the route handler
  };
}
