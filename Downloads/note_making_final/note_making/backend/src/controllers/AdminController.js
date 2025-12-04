const User = require('../models/User');
const { Note } = require('../models/Note');
const { Group } = require('../models/Group');
const Notification = require('../models/Notification');
const TagService = require('../services/TagService');

/**
 * Admin Controller
 * Handles admin dashboard and analytics
 */
class AdminController {
  /**
   * Get all users
   */
  static async getUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find()
          .select('-password')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        User.countDocuments(),
      ]);

      res.json({
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate user
   */
  static async deactivateUser(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deactivated', user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activate user
   */
  static async activateUser(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: true },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User activated', user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get analytics dashboard
   */
  static async getAnalytics(req, res, next) {
    try {
      const [
        totalNotes,
        totalUsers,
        totalSharedNotes,
        mostActiveUsers,
        mostUsedTags,
        totalGroups,
      ] = await Promise.all([
        Note.countDocuments({ isDeleted: false }),
        User.countDocuments(),
        Note.countDocuments({ isShared: true, isDeleted: false }),
        User.aggregate([
          {
            $addFields: {
              noteCount: {
                $cond: [
                  {
                    $isArray: '$notes',
                  },
                  {
                    $size: '$notes',
                  },
                  0,
                ],
              },
            },
          },
          {
            $sort: { noteCount: -1 },
          },
          {
            $limit: 10,
          },
        ]),
        Note.aggregate([
          {
            $unwind: '$tags',
          },
          {
            $group: {
              _id: '$tags',
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $limit: 10,
          },
          {
            $lookup: {
              from: 'tags',
              localField: '_id',
              foreignField: '_id',
              as: 'tagInfo',
            },
          },
        ]),
        Group.countDocuments(),
      ]);

      const analytics = {
        totalNotes,
        totalUsers,
        totalSharedNotes,
        totalGroups,
        mostActiveUsers: mostActiveUsers.slice(0, 5),
        mostUsedTags: mostUsedTags.slice(0, 5),
      };

      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user activity
   */
  static async getUserActivity(req, res, next) {
    try {
      const { userId } = req.params;

      const [user, notes, groups, notifications] = await Promise.all([
        User.findById(userId).select('-password'),
        Note.countDocuments({ owner: userId, isDeleted: false }),
        Group.countDocuments({ 'members.userId': userId }),
        Notification.countDocuments({ recipient: userId }),
      ]);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user,
        stats: {
          totalNotes: notes,
          totalGroups: groups,
          totalNotifications: notifications,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
