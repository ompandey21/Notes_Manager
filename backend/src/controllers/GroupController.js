const GroupService = require('../services/GroupService');

/**
 * Group Controller
 * Handles group/team operations
 */
class GroupController {
  /**
   * Create group
   */
  static async createGroup(req, res, next) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Group name required' });
      }

      const group = await GroupService.createGroup(req.user.id, name, description);
      res.status(201).json(group);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's groups
   */
  static async getUserGroups(req, res, next) {
    try {
      const groups = await GroupService.getUserGroups(req.user.id);
      res.json(groups);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get group by ID
   */
  static async getGroupById(req, res, next) {
    try {
      const group = await GroupService.getGroupById(req.params.id, req.user.id);
      res.json(group);
    } catch (error) {
      if (error.message.includes('Not a member')) {
        return res.status(403).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * Add member
   */
  static async addMember(req, res, next) {
    try {
      const { memberId, memberEmail } = req.body;

      if (!memberId && !memberEmail) {
        return res.status(400).json({ error: 'Member ID or email required' });
      }

      const group = await GroupService.addMember(
        req.params.id,
        req.user.id,
        memberId,
        memberEmail
      );

      res.json(group);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove member
   */
  static async removeMember(req, res, next) {
    try {
      const { memberId } = req.body;

      if (!memberId) {
        return res.status(400).json({ error: 'Member ID required' });
      }

      const group = await GroupService.removeMember(req.params.id, req.user.id, memberId);
      res.json(group);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update group
   */
  static async updateGroup(req, res, next) {
    try {
      const { name, description } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;

      const group = await GroupService.updateGroup(req.params.id, req.user.id, updateData);
      res.json(group);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete group
   */
  static async deleteGroup(req, res, next) {
    try {
      const result = await GroupService.deleteGroup(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GroupController;
