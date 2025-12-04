const { Group, Comment } = require('../models/Group');
const User = require('../models/User');
const { Note } = require('../models/Note');

/**
 * Group Service
 * Handles group/team management and collaboration
 */
class GroupService {
  /**
   * Create a new group
   */
  static async createGroup(ownerId, name, description = '') {
    const group = new Group({
      name,
      description,
      owner: ownerId,
      members: [
        {
          userId: ownerId,
          role: 'OWNER',
        },
      ],
    });

    await group.save();
    return group.populate('members.userId', 'username email profileImage');
  }

  /**
   * Get user's groups
   */
  static async getUserGroups(userId) {
    return Group.find({
      $or: [
        { owner: userId },
        { 'members.userId': userId },
      ],
    })
      .populate('owner', 'username email profileImage')
      .populate('members.userId', 'username email profileImage')
      .sort({ createdAt: -1 });
  }

  /**
   * Get group by ID
   */
  static async getGroupById(groupId, userId) {
    const group = await Group.findById(groupId)
      .populate('owner', 'username email profileImage')
      .populate('members.userId', 'username email profileImage');

    if (!group) {
      throw new Error('Group not found');
    }

    // Check if user is member
    const isMember = group.owner._id.toString() === userId ||
      group.members.some(m => m.userId._id.toString() === userId);

    if (!isMember) {
      throw new Error('Not a member of this group');
    }

    return group;
  }

  /**
   * Add member to group
   */
  static async addMember(groupId, userId, memberId, memberEmail) {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    // Check authorization
    if (group.owner.toString() !== userId) {
      throw new Error('Only group owner can add members');
    }

    // Find user by email if not provided ID
    let targetUserId = memberId;
    if (!targetUserId && memberEmail) {
      const user = await User.findOne({ email: memberEmail });
      if (!user) {
        throw new Error('User not found');
      }
      targetUserId = user._id;
    }

    // Check if already member
    const alreadyMember = group.members.some(m => 
      m.userId.toString() === targetUserId.toString()
    );

    if (alreadyMember) {
      throw new Error('User is already a member');
    }

    group.members.push({
      userId: targetUserId,
      role: 'MEMBER',
    });

    await group.save();
    return group.populate('members.userId', 'username email profileImage');
  }

  /**
   * Remove member from group
   */
  static async removeMember(groupId, userId, memberId) {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    if (group.owner.toString() !== userId) {
      throw new Error('Only group owner can remove members');
    }

    if (group.owner.toString() === memberId) {
      throw new Error('Cannot remove group owner');
    }

    group.members = group.members.filter(m => 
      m.userId.toString() !== memberId
    );

    await group.save();
    return group;
  }

  /**
   * Update group
   */
  static async updateGroup(groupId, userId, updateData) {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    if (group.owner.toString() !== userId) {
      throw new Error('Only group owner can update group');
    }

    if (updateData.name) group.name = updateData.name;
    if (updateData.description) group.description = updateData.description;

    await group.save();
    return group;
  }

  /**
   * Delete group
   */
  static async deleteGroup(groupId, userId) {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    if (group.owner.toString() !== userId) {
      throw new Error('Only group owner can delete group');
    }

    await Group.findByIdAndDelete(groupId);
    return { message: 'Group deleted successfully' };
  }
}

module.exports = GroupService;
