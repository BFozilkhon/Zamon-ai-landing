const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const Article = require('../models/article.model');
const User = require('../models/user.model');

/**
 * @route   GET /api/articles
 * @desc    Get all articles with pagination and filtering
 * @access  Public
 */
const getArticles = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      tag, 
      search,
      sort = 'createdAt:desc'
    } = req.query;
    
    // Build query
    const query = {};
    
    // Status filter (non-admins can only see published)
    if (req.user && (req.user.role === 'admin' || req.user.role === 'editor')) {
      if (status) query.status = status;
    } else {
      query.status = 'published';
    }
    
    // Category filter
    if (category) query.category = category;
    
    // Tag filter
    if (tag) query.tags = tag;
    
    // Search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Parse sort option
    const [sortField, sortDirection] = sort.split(':');
    const sortOptions = { 
      [sortField]: sortDirection === 'asc' ? 1 : -1 
    };
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const articles = await Article.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username name avatar')
      .populate('commentCount');
    
    // Get total count for pagination
    const totalArticles = await Article.countDocuments(query);
    
    res.json({
      articles,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalArticles / parseInt(limit)),
      totalArticles
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/articles/:id
 * @desc    Get article by ID
 * @access  Public
 */
const getArticleById = async (req, res) => {
  try {
    // Populate author and comments
    const article = await Article.findById(req.params.id)
      .populate('author', 'username name avatar bio')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username name avatar'
        },
        options: { limit: 10 }
      });
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Users without editor/admin role can only see published articles
    if (
      article.status !== 'published' && 
      (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor'))
    ) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Increment view count if not the author viewing
    if (!req.user || req.user._id.toString() !== article.author._id.toString()) {
      article.viewCount += 1;
      await article.save();
    }
    
    res.json(article);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/articles/slug/:slug
 * @desc    Get article by slug
 * @access  Public
 */
const getArticleBySlug = async (req, res) => {
  try {
    // Populate author and comments
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'username name avatar bio')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username name avatar'
        },
        options: { limit: 10 }
      });
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Users without editor/admin role can only see published articles
    if (
      article.status !== 'published' && 
      (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor'))
    ) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Increment view count if not the author viewing
    if (!req.user || req.user._id.toString() !== article.author._id.toString()) {
      article.viewCount += 1;
      await article.save();
    }
    
    res.json(article);
  } catch (error) {
    console.error('Get article by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   POST /api/articles
 * @desc    Create a new article
 * @access  Private
 */
const createArticle = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      title, 
      content, 
      excerpt, 
      category, 
      tags = [], 
      status = 'draft',
      featuredImage = ''
    } = req.body;
    
    // Create article
    const article = new Article({
      title,
      content,
      excerpt,
      category,
      tags,
      status,
      featuredImage,
      author: req.user._id
    });
    
    // Save article
    await article.save();
    
    // Return the saved article with populated author
    const savedArticle = await Article.findById(article._id)
      .populate('author', 'username name avatar');
    
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Server error during article creation' });
  }
};

/**
 * @route   PUT /api/articles/:id
 * @desc    Update an article
 * @access  Private
 */
const updateArticle = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      title, 
      content, 
      excerpt, 
      category, 
      tags,
      status,
      featuredImage
    } = req.body;
    
    // Find article
    let article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check ownership or admin/editor rights
    if (
      article.author.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin' && 
      req.user.role !== 'editor'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this article' });
    }
    
    // Update fields
    if (title) article.title = title;
    if (content) article.content = content;
    if (excerpt) article.excerpt = excerpt;
    if (category) article.category = category;
    if (tags) article.tags = tags;
    if (status) article.status = status;
    if (featuredImage !== undefined) article.featuredImage = featuredImage;
    
    // Save updated article
    await article.save();
    
    // Return the updated article with populated author
    const updatedArticle = await Article.findById(article._id)
      .populate('author', 'username name avatar');
    
    res.json(updatedArticle);
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ message: 'Server error during article update' });
  }
};

/**
 * @route   DELETE /api/articles/:id
 * @desc    Delete an article
 * @access  Private
 */
const deleteArticle = async (req, res) => {
  try {
    // Find article
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check ownership or admin rights
    if (
      article.author.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }
    
    // Delete featured image if exists and isn't a URL
    if (article.featuredImage && !article.featuredImage.startsWith('http')) {
      const imagePath = path.join(__dirname, '../../' + article.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete article
    await article.remove();
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: 'Server error during article deletion' });
  }
};

/**
 * @route   POST /api/articles/:id/like
 * @desc    Like/unlike an article
 * @access  Private
 */
const toggleLike = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check if user already liked the article
    const index = article.likes.indexOf(req.user._id);
    
    if (index === -1) {
      // Add like
      article.likes.push(req.user._id);
      article.likeCount += 1;
    } else {
      // Remove like
      article.likes.splice(index, 1);
      article.likeCount -= 1;
    }
    
    await article.save();
    
    res.json({
      liked: index === -1,
      likeCount: article.likeCount
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/articles/categories
 * @desc    Get all categories with article counts
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    const categoryCounts = await Article.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(categoryCounts.map(c => ({ name: c._id, count: c.count })));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/articles/tags
 * @desc    Get all tags with article counts
 * @access  Public
 */
const getTags = async (req, res) => {
  try {
    const tagCounts = await Article.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(tagCounts.map(t => ({ name: t._id, count: t.count })));
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/articles/user/:userId
 * @desc    Get articles by user
 * @access  Public
 */
const getArticlesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { author: userId };
    
    // Non-admins can only see published
    if (!req.user || (req.user.role !== 'admin' && req.user._id.toString() !== userId)) {
      query.status = 'published';
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get articles
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username name avatar')
      .populate('commentCount');
    
    // Get total count
    const totalArticles = await Article.countDocuments(query);
    
    res.json({
      articles,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalArticles / parseInt(limit)),
      totalArticles
    });
  } catch (error) {
    console.error('Get user articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLike,
  getCategories,
  getTags,
  getArticlesByUser
}; 