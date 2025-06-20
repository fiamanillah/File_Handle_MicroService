import { Request, Response } from 'express';
import { ApiKeyModel } from '../models/ApiKey';
import crypto from 'crypto';
import { logger } from '@utils/logger';
export const generateApiKey = async (req: Request, res: Response) => {
  try {
    const { serviceName, permissions } = req.body;

    if (!serviceName || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const key = `sk_${crypto.randomBytes(16).toString('hex')}`; // Generate a random key
    const newApiKey = await ApiKeyModel.create({
      serviceName,
      key,
      permissions,
      isActive: true,
    });
    if (!newApiKey) {
      return res.status(500).json({ error: 'Failed to create API key' });
    }
    // Return the generated key
    logger.info(`Generated API key for service: ${serviceName}`, {
      serviceName,
      permissions,
      key: newApiKey.key,
    });
    res.status(201).json({ key: newApiKey.key, serviceName, permissions });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    logger.error('Error generating API key', {
      error: error instanceof Error ? error.message : 'Unknown error',
      serviceName: req.body.serviceName,
      permissions: req.body.permissions,
    });
  }
};

export const revokeApiKey = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const updated = await ApiKeyModel.findOneAndUpdate(
      { key },
      { isActive: false },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ message: 'API key revoked', key: updated.key });
    logger.info(`Revoked API key: ${key}`, {
      key: updated.key,
      serviceName: updated.serviceName,
      permissions: updated.permissions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    logger.error('Error revoking API key', {
      error: error instanceof Error ? error.message : 'Unknown error',
      key: req.params.key,
    });
  }
};

export const getApiKeys = async (req: Request, res: Response) => {
  try {
    const apiKeys = await ApiKeyModel.find({ isActive: true });
    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    logger.error('Error fetching API keys', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
