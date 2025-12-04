const NoteService = require('../services/NoteService');

/**
 * Note Controller
 * Handles note CRUD operations
 */
class NoteController {
  /**
   * Create a new note
   */
  static async createNote(req, res, next) {
    try {
      const { title, content } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const note = await NoteService.createNote(req.user.id, title, content);
      res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's notes with filtering
   */
  static async getUserNotes(req, res, next) {
    try {
      const filters = {
        tag: req.query.tag,
        search: req.query.search,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };

      const notes = await NoteService.getUserNotes(req.user.id, filters);
      res.json(notes);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single note
   */
  static async getNoteById(req, res, next) {
    try {
      const note = await NoteService.getNoteById(req.params.id, req.user.id);
      res.json(note);
    } catch (error) {
      if (error.message === 'Note not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Access denied') {
        return res.status(403).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * Update note
   */
  static async updateNote(req, res, next) {
    try {
      const { title, content, changeReason } = req.body;

      if (!title || content === undefined) {
        return res.status(400).json({ error: 'Title and content required' });
      }

      const note = await NoteService.updateNote(
        req.params.id,
        req.user.id,
        title,
        content,
        changeReason
      );

      res.json(note);
    } catch (error) {
      if (error.message.includes('permission')) {
        return res.status(403).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * Delete note
   */
  static async deleteNote(req, res, next) {
    try {
      await NoteService.deleteNote(req.params.id, req.user.id);
      res.json({ message: 'Note deleted' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add tag to note
   */
  static async addTag(req, res, next) {
    try {
      const { tagId } = req.body;

      if (!tagId) {
        return res.status(400).json({ error: 'Tag ID required' });
      }

      const note = await NoteService.addTagToNote(req.params.id, tagId, req.user.id);
      res.json(note);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove tag from note
   */
  static async removeTag(req, res, next) {
    try {
      const { tagId } = req.body;

      if (!tagId) {
        return res.status(400).json({ error: 'Tag ID required' });
      }

      const note = await NoteService.removeTagFromNote(req.params.id, tagId, req.user.id);
      res.json(note);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get note versions
   */
  static async getVersions(req, res, next) {
    try {
      const versions = await NoteService.getNoteVersions(req.params.id, req.user.id);
      res.json(versions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Restore note version
   */
  static async restoreVersion(req, res, next) {
    try {
      const { versionId } = req.body;

      if (!versionId) {
        return res.status(400).json({ error: 'Version ID required' });
      }

      const note = await NoteService.restoreNoteVersion(
        req.params.id,
        versionId,
        req.user.id
      );

      res.json(note);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add comment
   */
  static async addComment(req, res, next) {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Comment content required' });
      }

      const comment = await NoteService.addComment(req.params.id, req.user.id, content);
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get comments
   */
  static async getComments(req, res, next) {
    try {
      const comments = await NoteService.getNoteComments(req.params.id);
      res.json(comments);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NoteController;
