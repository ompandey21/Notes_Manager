const express = require('express');
const AdminController = require('../controllers/AdminController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * Admin Routes
 */
router.get('/users', authenticateToken, authorizeAdmin, AdminController.getUsers);
router.put('/users/:userId/deactivate', authenticateToken, authorizeAdmin, AdminController.deactivateUser);
router.put('/users/:userId/activate', authenticateToken, authorizeAdmin, AdminController.activateUser);
router.get('/analytics', authenticateToken, authorizeAdmin, AdminController.getAnalytics);
router.get('/users/:userId/activity', authenticateToken, authorizeAdmin, AdminController.getUserActivity);

module.exports = router;
