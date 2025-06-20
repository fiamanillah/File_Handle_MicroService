"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Dashboard route
router.get('/', (req, res) => {
    res.render('dashboard/dashboard', {
        title: 'Dashboard',
        heading: 'Admin Dashboard',
    });
});
exports.default = router;
