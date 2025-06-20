import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiKeyRoutes from '@routes/apiKeyRoutes';
import { initializeDefaultAdmin } from '@models/Admin';
import authRoutes from '@routes/authRoutes';
import uploadRoutes from '@routes/filesRoutes';
import cookieParser from 'cookie-parser';
import dashboardRoutes from '@routes/dashboardRoutes';
import viewRoutes from '@routes/viewRoutes';
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

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home Page',
    heading: 'Welcome to My Site',
    userLoggedIn: false,
    username: 'JohnDoe',
    items: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }],
  });
});

// Initialize default admin user
initializeDefaultAdmin();

// Routes
app.use('/api/keys', apiKeyRoutes);

app.use('/api/auth', authRoutes);

app.use('/api', uploadRoutes);

app.use('/dashboard', dashboardRoutes);

app.use('/', viewRoutes);

export default app;
