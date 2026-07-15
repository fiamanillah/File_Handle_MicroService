import { Router } from 'express';

const router = Router();

router.get('/login', (req, res) => {
  res.render('adminLogin', { error: null });
});

export default router;
