// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/Admin';

declare global {
  namespace Express {
    interface Request {
      admin?: {
        username: string;
      };
    }
  }
}

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      username: string;
    };

    // Check if admin still exists
    const admin = await AdminModel.findOne({ username: decoded.username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Attach admin to request
    req.admin = { username: admin.username };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
