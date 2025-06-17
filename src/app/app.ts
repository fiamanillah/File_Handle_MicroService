import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiKeyRoutes from '@routes/apiKeyRoutes';
import { initializeDefaultAdmin } from '@models/Admin';
import authRoutes from '@routes/authRoutes';
import uploadRoutes from '@routes/filesRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
  res.json({ message: 'Server is running' });
});

initializeDefaultAdmin();
// Routes
app.use('/api/keys', apiKeyRoutes);

app.use('/api/auth', authRoutes);

app.use('/api', uploadRoutes);

export default app;
