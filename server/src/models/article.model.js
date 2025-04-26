const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('../utils/slugify');

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Article content is required']
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Article category is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  featuredImage: {
    type: String,
    default: null
  },
  comments: [CommentSchema],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for search functionality
ArticleSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text' 
});

// Virtual for comment count
ArticleSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for like count
ArticleSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Ensure virtuals are included in JSON
ArticleSchema.set('toJSON', { virtuals: true });
ArticleSchema.set('toObject', { virtuals: true });

// Add virtual for articleId
ArticleSchema.virtual('articleId').get(function() {
  return this._id;
});

// Add virtual for comments
ArticleSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
  options: { sort: { createdAt: -1 } }
});

// Create/update slug before saving
ArticleSchema.pre('save', async function(next) {
  // Only update slug if title changed or if it's a new document
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title);
    
    // Check if slug is unique
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const articlesWithSlug = await this.constructor.find({ slug: slugRegEx });
    
    // If not unique, add a suffix
    if (articlesWithSlug.length > 0) {
      this.slug = `${this.slug}-${articlesWithSlug.length + 1}`;
    }
  }
  
  // Set publishedAt date when article is published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Index for full-text search
ArticleSchema.index(
  { title: 'text', content: 'text', excerpt: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, excerpt: 3, content: 1 } }
);

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article; 