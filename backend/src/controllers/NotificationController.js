const NotificationService = require('../services/NotificationService');

/**
 * Notification Controller
 * Handles notification operations
 */
class NotificationController {
  /**
   * Get user notifications
   */
  static async getNotifications(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const notifications = await NotificationService.getUserNotifications(req.user.id, limit);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(req, res, next) {
    try {
      const count = await NotificationService.getUnreadCount(req.user.id);
      res.json({ unreadCount: count });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark as read
   */
  static async markAsRead(req, res, next) {
    try {
      const notification = await NotificationService.markAsRead(req.params.id, req.user.id);
      res.json(notification);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark all as read
   */
  static async markAllAsRead(req, res, next) {
    try {
      await NotificationService.markAllAsRead(req.user.id);
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(req, res, next) {
    try {
      const result = await NotificationService.deleteNotification(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NotificationController;
