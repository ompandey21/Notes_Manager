const express = require('express');
const NoteController = require('../controllers/NoteController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Note Routes
 */
router.post('/', authenticateToken, NoteController.createNote);
router.get('/', authenticateToken, NoteController.getUserNotes);
router.get('/:id', authenticateToken, NoteController.getNoteById);
router.put('/:id', authenticateToken, NoteController.updateNote);
router.delete('/:id', authenticateToken, NoteController.deleteNote);

/**
 * Tag Routes on Notes
 */
router.post('/:id/tags', authenticateToken, NoteController.addTag);
router.delete('/:id/tags', authenticateToken, NoteController.removeTag);

/**
 * Version Routes
 */
router.get('/:id/versions', authenticateToken, NoteController.getVersions);
router.post('/:id/versions/restore', authenticateToken, NoteController.restoreVersion);

/**
 * Comment Routes
 */
router.post('/:id/comments', authenticateToken, NoteController.addComment);
router.get('/:id/comments', authenticateToken, NoteController.getComments);

module.exports = router;
