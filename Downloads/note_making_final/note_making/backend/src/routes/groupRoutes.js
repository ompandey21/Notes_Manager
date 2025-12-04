const express = require('express');
const GroupController = require('../controllers/GroupController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Group Routes
 */
router.post('/', authenticateToken, GroupController.createGroup);
router.get('/', authenticateToken, GroupController.getUserGroups);
router.get('/:id', authenticateToken, GroupController.getGroupById);
router.put('/:id', authenticateToken, GroupController.updateGroup);
router.delete('/:id', authenticateToken, GroupController.deleteGroup);

/**
 * Member Routes
 */
router.post('/:id/members', authenticateToken, GroupController.addMember);
router.delete('/:id/members', authenticateToken, GroupController.removeMember);

module.exports = router;
