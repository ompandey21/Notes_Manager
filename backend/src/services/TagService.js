const { Tag, Note } = require('../models/Note');

/**
 * Tag Service
 * Handles tag creation, management, and filtering
 */
class TagService {
  /**
   * Create a new tag
   */
  static async createTag(userId, name, color = '#3b82f6', isGlobal = false) {
    const tag = new Tag({
      name,
      color,
      owner: userId,
      isGlobal,
    });

    await tag.save();
    return tag;
  }

  /**
   * Get user's tags
   */
  static async getUserTags(userId) {
    return Tag.find({
      $or: [
        { owner: userId },
        { isGlobal: true },
      ],
    }).sort({ name: 1 });
  }

  /**
   * Update tag
   */
  static async updateTag(tagId, userId, updateData) {
    const tag = await Tag.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    if (tag.owner.toString() !== userId && !tag.isGlobal) {
      throw new Error('Not authorized to update this tag');
    }

    Object.assign(tag, updateData);
    await tag.save();
    return tag;
  }

  /**
   * Delete tag
   */
  static async deleteTag(tagId, userId) {
    const tag = await Tag.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    if (tag.owner.toString() !== userId) {
      throw new Error('Not authorized to delete this tag');
    }

    // Remove tag from all notes
    await Note.updateMany(
      { tags: tagId },
      { $pull: { tags: tagId } }
    );

    await Tag.findByIdAndDelete(tagId);
    return { message: 'Tag deleted successfully' };
  }

  /**
   * Get most used tags
   */
  static async getMostUsedTags(userId, limit = 10) {
    const result = await Note.aggregate([
      {
        $match: {
          owner: userId,
          isDeleted: false,
        },
      },
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
        $limit: limit,
      },
      {
        $lookup: {
          from: 'tags',
          localField: '_id',
          foreignField: '_id',
          as: 'tagInfo',
        },
      },
    ]);

    return result;
  }
}

module.exports = TagService;
