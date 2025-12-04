const TagService = require('../services/TagService');

/**
 * Tag Controller
 * Handles tag operations
 */
class TagController {
  /**
   * Create tag
   */
  static async createTag(req, res, next) {
    try {
      const { name, color, isGlobal } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Tag name required' });
      }

      const tag = await TagService.createTag(req.user.id, name, color, isGlobal);
      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user tags
   */
  static async getUserTags(req, res, next) {
    try {
      const tags = await TagService.getUserTags(req.user.id);
      res.json(tags);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update tag
   */
  static async updateTag(req, res, next) {
    try {
      const { name, color } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (color) updateData.color = color;

      const tag = await TagService.updateTag(req.params.id, req.user.id, updateData);
      res.json(tag);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete tag
   */
  static async deleteTag(req, res, next) {
    try {
      const result = await TagService.deleteTag(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get most used tags
   */
  static async getMostUsedTags(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const tags = await TagService.getMostUsedTags(req.user.id, limit);
      res.json(tags);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TagController;
