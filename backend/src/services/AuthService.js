const User = require('../models/User');
const { generateToken } = require('../utils/helpers');

/**
 * Authentication Service
 * Handles user signup, login, and token management
 */
class AuthService {
  /**
   * Register a new user
   */
  static async signup(username, email, password) {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();
    return user;
  }

  /**
   * Login user
   */
  static async login(email, password) {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const token = generateToken(user);
    return { token, user };
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = AuthService;
