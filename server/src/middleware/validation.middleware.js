const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to validate request data
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Validation rules for article creation
 */
const createArticleRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
    
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Excerpt must be less than 200 characters'),
    
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
    
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .custom(tags => {
      if (tags && tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    }),
    
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['draft', 'published', 'archived']).withMessage('Status must be draft, published, or archived'),
    
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean value'),
    
  body('featuredImage')
    .optional()
    .isURL().withMessage('Featured image must be a valid URL')
];

/**
 * Validation rules for article update
 */
const updateArticleRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    
  body('content')
    .optional()
    .trim()
    .isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
    
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Excerpt must be less than 200 characters'),
    
  body('category')
    .optional()
    .trim(),
    
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .custom(tags => {
      if (tags && tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    }),
    
  body('status')
    .optional()
    .trim()
    .isIn(['draft', 'published', 'archived']).withMessage('Status must be draft, published, or archived'),
    
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean value'),
    
  body('featuredImage')
    .optional()
    .isURL().withMessage('Featured image must be a valid URL')
];

/**
 * Validation rules for user registration
 */
const registerUserRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
    
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must include uppercase, lowercase, number, and special character'),
    
  body('role')
    .optional()
    .isIn(['user', 'editor', 'admin']).withMessage('Role must be user, editor, or admin')
];

/**
 * Validation rules for user login
 */
const loginUserRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
    
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for updating user profile
 */
const updateUserRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
    
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
    
  body('avatar')
    .optional()
    .isURL().withMessage('Avatar must be a valid URL')
];

/**
 * Validation rules for pagination and filtering
 */
const paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
    
  query('sortBy')
    .optional()
    .isString().withMessage('Sort field must be a string'),
    
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
];

/**
 * Validation for article ID parameter
 */
const validateArticleId = [
  param('id')
    .isMongoId().withMessage('Invalid article ID format')
];

/**
 * Validation for user ID parameter
 */
const validateUserId = [
  param('id')
    .isMongoId().withMessage('Invalid user ID format')
];

module.exports = {
  validateRequest,
  createArticleRules,
  updateArticleRules,
  registerUserRules,
  loginUserRules,
  updateUserRules,
  paginationRules,
  validateArticleId,
  validateUserId
}; 