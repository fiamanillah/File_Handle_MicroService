import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiKeyRoutes from '@routes/apiKeyRoutes';
import { initializeDefaultAdmin } from '@models/Admin';
import authRoutes from '@routes/authRoutes';
import uploadRoutes from '@routes/filesRoutes';
import cookieParser from 'cookie-parser';
import viewRoutes from '@routes/viewRoutes';
import { authenticateAdmin } from 'middlewares/auth';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'src/views');

// Static files middleware
app.use(express.static('public'));

// Health Check
app.get('/health', (_req, res) => {
  res.json({ message: 'Server is running' });
});

app.get('/', authenticateAdmin, (req, res) => {
  res.redirect('/api/keys');
});

// Initialize default admin user
initializeDefaultAdmin();

// Routes
app.use('/api/keys', apiKeyRoutes);

app.use('/api/auth', authRoutes);

app.use('/api', uploadRoutes);

app.use('/', viewRoutes);

export default app;
