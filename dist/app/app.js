"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const apiKeyRoutes_1 = __importDefault(require("@routes/apiKeyRoutes"));
const Admin_1 = require("@models/Admin");
const authRoutes_1 = __importDefault(require("@routes/authRoutes"));
const filesRoutes_1 = __importDefault(require("@routes/filesRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dashboardRoutes_1 = __importDefault(require("@routes/dashboardRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'src/views');
// Static files middleware
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
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
(0, Admin_1.initializeDefaultAdmin)();
// Routes
app.use('/api/keys', apiKeyRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api', filesRoutes_1.default);
app.use('/dashboard', dashboardRoutes_1.default);
app.get('/admin/login', (req, res) => {
    res.render('adminLogin', { error: null });
});
exports.default = app;
