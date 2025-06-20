// src/routes/dashboardRoutes.ts
import { Router } from 'express';
import { getApiKeys } from '@controllers/apiKeyController';
import { authenticateAdmin } from 'middlewares/auth';

const router = Router();

// Dashboard route - protected by admin auth
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    res.render('dashboard/dashboard', {
      title: 'Dashboard',
      heading: 'Admin Dashboard',
    });
  } catch (error) {
    res.redirect('/login');
  }
});

export default router;
