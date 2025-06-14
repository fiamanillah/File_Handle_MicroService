// src/routes/authRoutes.ts
import express from 'express';
import { loginAdmin, getAdminProfile } from '../controllers/authController';
import { authenticateAdmin } from 'middlewares/auth';

const router = express.Router();

// Public route
router.post('/login', loginAdmin);

// Protected routes
router.get('/profile', authenticateAdmin, getAdminProfile);

export default router;
