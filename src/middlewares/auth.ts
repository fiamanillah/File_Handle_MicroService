import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/Admin';

declare module 'express' {
  interface Request {
    admin?: {
      username: string;
    };
  }
}

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      return res.redirect('/login');
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        username: string;
      };

      // Check if admin still exists
      const admin = await AdminModel.findOne({ username: decoded.username });
      if (!admin) {
        return res.redirect('/login');
      }

      // Attach admin to request
      req.admin = { username: admin.username };
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.redirect('/login');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.redirect('/login');
      }
      throw error; // Re-throw other unexpected errors
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
