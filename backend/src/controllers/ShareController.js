const ShareService = require('../services/ShareService');

/**
 * Share Controller
 * Handles note sharing and permissions
 */
class ShareController {
  /**
   * Share note with user
   */
  static async shareWithUser(req, res, next) {
    try {
      const { sharedWithId, permission } = req.body;

      if (!sharedWithId) {
        return res.status(400).json({ error: 'Shared with ID required' });
      }

      const note = await ShareService.shareNoteWithUser(
        req.params.id,
        req.user.id,
        sharedWithId,
        permission
      );

      res.json(note);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Share note with group
   */
  static async shareWithGroup(req, res, next) {
    try {
      const { groupId, permission } = req.body;

      if (!groupId) {
        return res.status(400).json({ error: 'Group ID required' });
      }

      const note = await ShareService.shareNoteWithGroup(
        req.params.id,
        req.user.id,
        groupId,
        permission
      );

      res.json(note);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unshare note
   */
  static async unshareNote(req, res, next) {
    try {
      const { sharedWithId, groupId } = req.body;

      const note = await ShareService.unshareNote(
        req.params.id,
        req.user.id,
        sharedWithId,
        groupId
      );

      res.json(note);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get shared notes
   */
  static async getSharedNotes(req, res, next) {
    try {
      const notes = await ShareService.getSharedNotes(req.user.id);
      res.json(notes);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update permission
   */
  static async updatePermission(req, res, next) {
    try {
      const { sharedWithId, permission } = req.body;

      if (!sharedWithId || !permission) {
        return res.status(400).json({ error: 'Shared with ID and permission required' });
      }

      const note = await ShareService.updateSharePermission(
        req.params.id,
        req.user.id,
        sharedWithId,
        permission
      );

      res.json(note);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get note shares
   */
  static async getNoteShares(req, res, next) {
    try {
      const shares = await ShareService.getNoteShares(req.params.id, req.user.id);
      res.json(shares);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ShareController;
