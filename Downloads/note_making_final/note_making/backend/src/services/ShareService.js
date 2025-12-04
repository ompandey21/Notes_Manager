const { Note } = require('../models/Note');
const { PERMISSIONS, NOTIFICATION_TYPES } = require('../config/constants');
const Notification = require('../models/Notification');

/**
 * Share Service
 * Handles note sharing and permission management
 */
class ShareService {
  /**
   * Share note with user
   */
  static async shareNoteWithUser(noteId, userId, sharedWithId, permission = PERMISSIONS.VIEW) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new Error('Only owner can share');
    }

    // Check if already shared
    const existingShare = note.shares.find(s => 
      s.sharedWith?.toString() === sharedWithId
    );

    if (existingShare) {
      existingShare.permission = permission;
    } else {
      note.shares.push({
        sharedWith: sharedWithId,
        permission,
        sharedBy: userId,
      });
    }

    note.isShared = true;
    await note.save();

    // Create notification
    const notification = new Notification({
      recipient: sharedWithId,
      type: NOTIFICATION_TYPES.NOTE_SHARED,
      actor: userId,
      note: noteId,
      message: `Note "${note.title}" was shared with you`,
      data: { permission },
    });

    await notification.save();

    return note;
  }

  /**
   * Share note with group
   */
  static async shareNoteWithGroup(noteId, userId, groupId, permission = PERMISSIONS.VIEW) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new Error('Only owner can share');
    }

    // Check if already shared with group
    const existingShare = note.shares.find(s => 
      s.groupId?.toString() === groupId
    );

    if (existingShare) {
      existingShare.permission = permission;
    } else {
      note.shares.push({
        groupId,
        permission,
        sharedBy: userId,
      });
    }

    note.isShared = true;
    await note.save();

    return note;
  }

  /**
   * Unshare note
   */
  static async unshareNote(noteId, userId, sharedWithId = null, groupId = null) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new Error('Only owner can unshare');
    }

    if (sharedWithId) {
      note.shares = note.shares.filter(s => 
        s.sharedWith?.toString() !== sharedWithId
      );
    } else if (groupId) {
      note.shares = note.shares.filter(s => 
        s.groupId?.toString() !== groupId
      );
    }

    note.isShared = note.shares.length > 0;
    await note.save();

    return note;
  }

  /**
   * Get shared notes
   */
  static async getSharedNotes(userId) {
    return Note.find({
      'shares.sharedWith': userId,
      isDeleted: false,
    })
      .populate('owner', 'username email profileImage')
      .populate('tags', 'name color')
      .sort({ updatedAt: -1 });
  }

  /**
   * Update share permission
   */
  static async updateSharePermission(noteId, userId, sharedWithId, permission) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new Error('Only owner can modify permissions');
    }

    const share = note.shares.find(s => 
      s.sharedWith?.toString() === sharedWithId
    );

    if (!share) {
      throw new Error('Share not found');
    }

    share.permission = permission;
    await note.save();

    return note;
  }

  /**
   * Get note shares
   */
  static async getNoteShares(noteId, userId) {
    const note = await Note.findById(noteId)
      .populate('shares.sharedWith', 'username email profileImage')
      .populate('shares.groupId', 'name');

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new Error('Only owner can view shares');
    }

    return note.shares;
  }
}

module.exports = ShareService;
