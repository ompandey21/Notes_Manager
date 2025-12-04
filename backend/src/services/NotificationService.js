const Notification = require('../models/Notification');
const { NOTIFICATION_STATUS } = require('../config/constants');

/**
 * Notification Service
 * Handles notifications and real-time notification management
 */
class NotificationService {
  /**
   * Get user notifications
   */
  static async getUserNotifications(userId, limit = 50) {
    return Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('actor', 'username email profileImage')
      .populate('note', 'title')
      .populate('group', 'name');
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(userId) {
    return Notification.countDocuments({
      recipient: userId,
      status: NOTIFICATION_STATUS.UNREAD,
    });
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.status = NOTIFICATION_STATUS.READ;
    notification.readAt = new Date();
    await notification.save();

    return notification;
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId) {
    return Notification.updateMany(
      {
        recipient: userId,
        status: NOTIFICATION_STATUS.UNREAD,
      },
      {
        status: NOTIFICATION_STATUS.READ,
        readAt: new Date(),
      }
    );
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId, userId) {
    const result = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!result) {
      throw new Error('Notification not found');
    }

    return { message: 'Notification deleted' };
  }

  /**
   * Create notification
   */
  static async createNotification(recipientId, type, actorId, message, noteId = null, groupId = null, data = {}) {
    const notification = new Notification({
      recipient: recipientId,
      type,
      actor: actorId,
      message,
      note: noteId,
      group: groupId,
      data,
    });

    await notification.save();
    return notification.populate('actor', 'username email profileImage');
  }
}

module.exports = NotificationService;
