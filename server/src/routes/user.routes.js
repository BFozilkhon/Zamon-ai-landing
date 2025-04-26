const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  getUserProfile, 
  updateProfile, 
  updateSettings,
  updateAvatar,
  toggleBookmark,
  getBookmarks,
  changePassword
} = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Set up multer storage for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use userId + timestamp to ensure unique filenames
    const uniqueSuffix = `${req.user._id}-${Date.now()}`;
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
  fileFilter
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put(
  '/profile',
  authenticate,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('social.twitter')
      .optional()
      .trim(),
    body('social.facebook')
      .optional()
      .trim(),
    body('social.linkedin')
      .optional()
      .trim(),
    body('social.website')
      .optional()
      .trim()
      .isURL()
      .withMessage('Website must be a valid URL')
  ],
  updateProfile
);

// @route   PUT /api/users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', authenticate, updateSettings);

// @route   PUT /api/users/avatar
// @desc    Upload/update user avatar
// @access  Private
router.put('/avatar', authenticate, upload.single('avatar'), updateAvatar);

// @route   POST /api/users/bookmark/:articleId
// @desc    Add/remove article bookmark
// @access  Private
router.post('/bookmark/:articleId', authenticate, toggleBookmark);

// @route   GET /api/users/bookmarks
// @desc    Get user's bookmarked articles
// @access  Private
router.get('/bookmarks', authenticate, getBookmarks);

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put(
  '/password',
  authenticate,
  [
    body('currentPassword')
      .not()
      .isEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
  ],
  changePassword
);

module.exports = router; 