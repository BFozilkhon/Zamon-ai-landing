const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Middleware to authenticate user using JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Invalid token format.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found or token is invalid.' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

/**
 * Middleware to check if user is an admin
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

/**
 * Middleware to check if user is an editor or admin
 */
const isEditorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'editor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Editor privileges required.' });
  }
};

/**
 * Middleware to check if user owns the resource or is an admin
 * Use this with resources that have a user field (like articles)
 */
const isOwnerOrAdmin = (req, res, next) => {
  // This assumes the resource has been fetched and attached to req.resource
  // with a user field (like req.article.user)
  if (!req.resource) {
    return res.status(404).json({ message: 'Resource not found.' });
  }
  
  const isOwner = req.resource.user && req.resource.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  
  if (isOwner || isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. You do not have permission to modify this resource.' });
  }
};

module.exports = {
  authenticate,
  isAdmin,
  isEditorOrAdmin,
  isOwnerOrAdmin
}; 