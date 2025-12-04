const express = require('express');
const TagController = require('../controllers/TagController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Tag Routes
 */
router.post('/', authenticateToken, TagController.createTag);
router.get('/', authenticateToken, TagController.getUserTags);
router.put('/:id', authenticateToken, TagController.updateTag);
router.delete('/:id', authenticateToken, TagController.deleteTag);
router.get('/most-used', authenticateToken, TagController.getMostUsedTags);

module.exports = router;
