const express = require('express');
const ShareController = require('../controllers/ShareController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Share Routes
 */
router.post('/:id/share-user', authenticateToken, ShareController.shareWithUser);
router.post('/:id/share-group', authenticateToken, ShareController.shareWithGroup);
router.delete('/:id/unshare', authenticateToken, ShareController.unshareNote);
router.get('/shared', authenticateToken, ShareController.getSharedNotes);
router.put('/:id/permission', authenticateToken, ShareController.updatePermission);
router.get('/:id/shares', authenticateToken, ShareController.getNoteShares);

module.exports = router;
