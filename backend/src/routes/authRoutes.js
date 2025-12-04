const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Auth Routes
 */
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.get('/users/search', authenticateToken, AuthController.findUserByEmail);
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);

module.exports = router;
