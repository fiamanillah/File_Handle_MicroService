// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/Admin';

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = await AdminModel.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { username: admin.username },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' },
    );

    res.json({
      token,
      username: admin.username,
      expiresIn: 3600, // 1 hour in seconds
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getAdminProfile = async (req: Request, res: Response) => {
  res.json({
    username: req.admin?.username,
    message: 'Authenticated as admin',
  });
};
