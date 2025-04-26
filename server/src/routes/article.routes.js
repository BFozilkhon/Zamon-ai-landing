const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const articleController = require('../controllers/article.controller');
const { authenticate, isEditorOrAdmin } = require('../middleware/auth.middleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/articles';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'article-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
  }
});

// Get all articles with pagination and filtering
router.get('/', articleController.getArticles);

// Get article by ID
router.get('/:id', articleController.getArticleById);

// Get article by slug
router.get('/slug/:slug', articleController.getArticleBySlug);

// Get categories with article counts
router.get('/categories', articleController.getCategories);

// Get tags with article counts
router.get('/tags', articleController.getTags);

// Get articles by user
router.get('/user/:userId', articleController.getArticlesByUser);

// Create article - requires authentication
router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty().withMessage('Title is required').trim().isLength({ max: 200 })
      .withMessage('Title must be less than 200 characters'),
    body('content').notEmpty().withMessage('Content is required'),
    body('excerpt').optional().trim().isLength({ max: 500 })
      .withMessage('Excerpt must be less than 500 characters'),
    body('category').notEmpty().withMessage('Category is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('status').optional().isIn(['draft', 'published', 'archived'])
      .withMessage('Status must be draft, published, or archived')
  ],
  articleController.createArticle
);

// Update article - requires authentication
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().isLength({ max: 200 })
      .withMessage('Title must be less than 200 characters'),
    body('content').optional(),
    body('excerpt').optional().trim().isLength({ max: 500 })
      .withMessage('Excerpt must be less than 500 characters'),
    body('category').optional(),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('status').optional().isIn(['draft', 'published', 'archived'])
      .withMessage('Status must be draft, published, or archived')
  ],
  articleController.updateArticle
);

// Delete article - requires authentication
router.delete('/:id', authenticate, articleController.deleteArticle);

// Like/unlike article - requires authentication
router.post('/:id/like', authenticate, articleController.toggleLike);

// Upload featured image - requires authentication
router.post(
  '/upload',
  authenticate,
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const imagePath = req.file.path.replace(/\\/g, '/'); // Normalize path for Windows
    res.json({ url: imagePath });
  }
);

module.exports = router; 