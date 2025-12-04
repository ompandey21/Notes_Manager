const { Note, NoteVersion, Tag } = require('../models/Note');
const { Comment } = require('../models/Group');
const { PERMISSIONS } = require('../config/constants');

/**
 * Note Service
 * Handles CRUD operations and version control for notes
 */
class NoteService {
  /**
   * Create a new note
   */
  static async createNote(ownerId, title, content = '') {
    const note = new Note({
      title,
      content,
      owner: ownerId,
    });

    await note.save();
    return note.populate('tags', 'name color');
  }

  /**
   * Get user's notes
   */
  static async getUserNotes(userId, filters = {}) {
    const query = {
      owner: userId,
      isDeleted: false,
    };

    if (filters.tag) {
      query.tags = filters.tag;
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    return Note.find(query)
      .sort({ updatedAt: -1 })
      .populate('owner', 'username email profileImage')
      .populate('tags', 'name color');
  }

  /**
   * Get single note with sharing checks
   */
  static async getNoteById(noteId, userId) {
    const note = await Note.findById(noteId)
      .populate('owner', 'username email profileImage')
      .populate('tags', 'name color');

    if (!note) {
      throw new Error('Note not found');
    }

    // Check access: owner or has share permission
    const isOwner = note.owner._id.toString() === userId;
    const hasAccess = isOwner || note.shares.some((share) => 
      share.sharedWith?.toString() === userId
    );

    if (!hasAccess) {
      throw new Error('Access denied');
    }

    return note;
  }

  /**
   * Update note content
   */
  static async updateNote(noteId, userId, title, content, changeReason = 'Updated') {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    // Check permission
    const isOwner = note.owner.toString() === userId;
    const hasEditPermission = note.shares.some(
      (share) => share.sharedWith?.toString() === userId && 
        (share.permission === PERMISSIONS.EDIT)
    );

    if (!isOwner && !hasEditPermission) {
      throw new Error('No edit permission');
    }

    // Create version before updating
    const version = new NoteVersion({
      noteId,
      title: note.title,
      content: note.content,
      changedBy: userId,
      changeReason,
    });

    await version.save();

    // Update note
    note.title = title;
    note.content = content;
    note.currentVersion += 1;
    await note.save();

    return note.populate('tags', 'name color');
  }

  /**
   * Delete note (soft delete)
   */
  static async deleteNote(noteId, userId) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new Error('Only owner can delete');
    }

    note.isDeleted = true;
    await note.save();
    return note;
  }

  /**
   * Add tag to note
   */
  static async addTagToNote(noteId, tagId, userId) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new Error('Only owner can modify tags');
    }

    if (!note.tags.includes(tagId)) {
      note.tags.push(tagId);
      await note.save();
    }

    return note.populate('tags', 'name color');
  }

  /**
   * Remove tag from note
   */
  static async removeTagFromNote(noteId, tagId, userId) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new Error('Only owner can modify tags');
    }

    note.tags = note.tags.filter(tag => tag.toString() !== tagId);
    await note.save();

    return note.populate('tags', 'name color');
  }

  /**
   * Get note version history
   */
  static async getNoteVersions(noteId, userId) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    const isOwner = note.owner.toString() === userId;
    if (!isOwner) {
      throw new Error('Only owner can view versions');
    }

    return NoteVersion.find({ noteId })
      .sort({ createdAt: -1 })
      .populate('changedBy', 'username email');
  }

  /**
   * Restore note to previous version
   */
  static async restoreNoteVersion(noteId, versionId, userId) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new Error('Only owner can restore versions');
    }

    const version = await NoteVersion.findById(versionId);

    if (!version) {
      throw new Error('Version not found');
    }

    // Create new version of current state
    const currentVersion = new NoteVersion({
      noteId,
      title: note.title,
      content: note.content,
      changedBy: userId,
      changeReason: `Restored from version ${version._id}`,
    });

    await currentVersion.save();

    // Restore content
    note.title = version.title;
    note.content = version.content;
    note.currentVersion += 1;
    await note.save();

    return note;
  }

  /**
   * Add comment to note
   */
  static async addComment(noteId, userId, content) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    const isOwner = note.owner.toString() === userId;
    const hasCommentAccess = note.shares.some(
      (share) => share.sharedWith?.toString() === userId &&
        (share.permission === PERMISSIONS.COMMENT || share.permission === PERMISSIONS.EDIT)
    );

    if (!isOwner && !hasCommentAccess) {
      throw new Error('No comment permission');
    }

    const comment = new Comment({
      noteId,
      author: userId,
      content,
    });

    await comment.save();
    return comment.populate('author', 'username email profileImage');
  }

  /**
   * Get note comments
   */
  static async getNoteComments(noteId) {
    return Comment.find({ noteId })
      .sort({ createdAt: -1 })
      .populate('author', 'username email profileImage');
  }
}

module.exports = NoteService;
