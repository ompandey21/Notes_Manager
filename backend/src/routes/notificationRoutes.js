const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Notification Routes
 */
router.get('/', authenticateToken, NotificationController.getNotifications);
router.get('/unread-count', authenticateToken, NotificationController.getUnreadCount);
router.put('/:id/read', authenticateToken, NotificationController.markAsRead);
router.put('/read-all', authenticateToken, NotificationController.markAllAsRead);
router.delete('/:id', authenticateToken, NotificationController.deleteNotification);

module.exports = router;
