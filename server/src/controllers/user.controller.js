const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const User = require('../models/user.model');

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile by ID
 * @access  Public
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -__v')
      .populate('articleBookmarks', 'title slug excerpt category createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, bio, social } = req.body;
    const updateData = {};
    
    // Only update fields that were sent in the request
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (social) updateData.social = social;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { $set: updateData }, 
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

/**
 * @route   PUT /api/users/settings
 * @desc    Update user settings
 * @access  Private
 */
const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({ message: 'Settings data is required' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { settings } },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   PUT /api/users/avatar
 * @desc    Upload/update user avatar
 * @access  Private
 */
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }
    
    // Get the old avatar path to delete later
    const user = await User.findById(req.user._id);
    const oldAvatar = user.avatar;
    
    // Update user with new avatar path
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: avatarPath } },
      { new: true }
    ).select('-password');
    
    // Delete old avatar file if it exists and isn't the default
    if (oldAvatar && oldAvatar !== '' && !oldAvatar.includes('default')) {
      const oldPath = path.join(__dirname, '../../' + oldAvatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Avatar update error:', error);
    res.status(500).json({ message: 'Server error during avatar update' });
  }
};

/**
 * @route   POST /api/users/bookmark/:articleId
 * @desc    Add/remove article bookmark
 * @access  Private
 */
const toggleBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if article is already bookmarked
    const isBookmarked = user.articleBookmarks.includes(articleId);
    
    if (isBookmarked) {
      // Remove bookmark
      user.articleBookmarks = user.articleBookmarks.filter(
        id => id.toString() !== articleId
      );
    } else {
      // Add bookmark
      user.articleBookmarks.push(articleId);
    }
    
    await user.save();
    
    res.json({
      bookmarked: !isBookmarked,
      bookmarks: user.articleBookmarks
    });
  } catch (error) {
    console.error('Bookmark toggle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/users/bookmarks
 * @desc    Get user's bookmarked articles
 * @access  Private
 */
const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('articleBookmarks')
      .populate('articleBookmarks', 'title slug excerpt category featuredImage createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.articleBookmarks);
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   PUT /api/users/password
 * @desc    Change user password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id);
    
    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  updateSettings,
  updateAvatar,
  toggleBookmark,
  getBookmarks,
  changePassword
}; 