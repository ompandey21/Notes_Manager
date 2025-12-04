const AuthService = require('../services/AuthService');
const User = require('../models/User');

/**
 * Authentication Controller
 * Handles auth-related requests
 */
class AuthController {
  /**
   * Register endpoint
   */
  static async signup(req, res, next) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const user = await AuthService.signup(username, email, password);
      const { generateToken } = require('../utils/helpers');
      const token = generateToken(user);

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login endpoint
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const { token, user } = await AuthService.login(email, password);

      res.json({
        message: 'Login successful',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getUserProfile(req.user.id);
      res.json(user.toJSON());
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req, res, next) {
    try {
      const { username, profileImage } = req.body;
      const updateData = {};

      if (username) updateData.username = username;
      if (profileImage) updateData.profileImage = profileImage;

      const user = await AuthService.updateProfile(req.user.id, updateData);
      res.json(user.toJSON());
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find user by email (shared note helper)
   */
  static async findUserByEmail(req, res, next) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ error: 'Email query parameter required' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user.toJSON());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
