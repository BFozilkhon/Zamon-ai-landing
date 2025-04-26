import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiCalendar, BiUser, BiTag, BiShareAlt, BiLike, BiCommentDetail } from 'react-icons/bi';
import commentService from '../../services/commentService';
import './style.css';

// Base64 encoded simple SVG placeholder
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzIyM2QwZCIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiM5ZmU4NzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

const ArticleDetail = ({ article }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [comments, setComments] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [likedComments, setLikedComments] = useState(new Set());
  const [likingInProgress, setLikingInProgress] = useState(new Set());

  useEffect(() => {
    loadComments();
  }, [article.id]);

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(article.id);
      setComments(data);
      
      // Load liked status for each comment
      const likedStatus = new Set();
      for (const comment of data) {
        try {
          const hasLiked = await commentService.hasLiked(comment.id);
          if (hasLiked) {
            likedStatus.add(comment.id);
          }
        } catch (err) {
          console.error('Error checking like status:', err);
        }
      }
      setLikedComments(likedStatus);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('Failed to load comments. Please try again later.');
    }
  };

  // Function to handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !commenterName.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newComment = await commentService.addComment({
        articleId: article.id,
        name: commenterName.trim(),
        content: commentText.trim()
      });
      
      setComments([newComment, ...comments]);
      setCommentText('');
      setCommenterName('');
      setShowCommentForm(false);
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeClick = async (commentId) => {
    if (likingInProgress.has(commentId)) return;
    
    setLikingInProgress(prev => new Set([...prev, commentId]));
    
    try {
      const { liked, likes } = await commentService.toggleLike(commentId);
      
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes } 
            : comment
        )
      );
      
      setLikedComments(prev => {
        const newSet = new Set(prev);
        if (liked) {
          newSet.add(commentId);
        } else {
          newSet.delete(commentId);
        }
        return newSet;
      });
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like. Please try again.');
    } finally {
      setLikingInProgress(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  // Get image source, removing @ prefix if present
  const getImageSource = () => {
    if (article.featuredImage) {
      const cleanUrl = article.featuredImage.startsWith('@') 
        ? article.featuredImage.substring(1) 
        : article.featuredImage;
      return cleanUrl || article.img || PLACEHOLDER_IMAGE;
    }
    return article.img || PLACEHOLDER_IMAGE;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="article-detail-container">
      <div className="article-detail-header">
        <div className="article-detail-meta">
          {article.category && (
            <span className="article-detail-category">{article.category}</span>
          )}
          <span className="article-detail-date">
            <BiCalendar className="article-icon" />
            {new Date(article.date).toLocaleDateString()}
          </span>
          {article.author && (
            <span className="article-detail-author">
              <BiUser className="article-icon" />
              {article.author}
            </span>
          )}
          {article.type && (
            <span className="article-detail-type">
              <BiTag className="article-icon" />
              {article.type}
            </span>
          )}
        </div>
        
        <h1 className="article-detail-title">{article.title}</h1>
        
        {article.tags && article.tags.length > 0 && (
          <div className="article-detail-tags">
            {article.tags.map((tag, index) => (
              <Link key={index} to={`/posts?tag=${tag}`} className="article-detail-tag">
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className={`article-detail-featured-image-container ${imageLoading ? 'loading' : ''}`}>
        {imageLoading && (
          <div className="image-loading-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img 
          src={getImageSource()}
          alt={article.title} 
          className={`article-detail-featured-image ${imageError ? 'error' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      
      <div className="article-detail-content">
        {/* Render the article content, handling both \br tags and regular newlines */}
        {article.content ? (
          article.content.split(/\\br|\n\n+/).map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="article-detail-paragraph">
                {paragraph.trim()}
              </p>
            )
          ))
        ) : (
          article?.description?.split(/\\br|\n\n+/).map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="article-detail-paragraph">
                {paragraph.trim()}
              </p>
            )
          ))
        )}
      </div>
      
      <div className="article-detail-actions">
        <div className="article-detail-share">
          <button className="article-action-button">
            <BiShareAlt /> Share
          </button>
        </div>
        
        <div className="article-detail-like">
          <button className="article-action-button">
            <BiLike /> Like
          </button>
        </div>
        
        <div className="article-detail-comment">
          <button 
            className="article-action-button"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            <BiCommentDetail /> Comment
          </button>
        </div>
      </div>
      
      {/* Comment Section */}
      <div className="article-detail-comments-section">
        <h3 className="comments-title">
          Comments ({comments.length})
        </h3>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {showCommentForm && (
          <div className="comment-form-container">
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <div className="form-group">
                <label htmlFor="commenterName">Name</label>
                <input
                  id="commenterName"
                  type="text"
                  className="comment-input"
                  placeholder="Enter your name"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="commentText">Comment</label>
                <textarea
                  id="commentText"
                  className="comment-textarea"
                  placeholder="Write your comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div className="comment-form-actions">
                <button 
                  type="button" 
                  className="comment-cancel-button"
                  onClick={() => setShowCommentForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="comment-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="comments-list">
          {!showCommentForm && (
            <button 
              className="add-comment-button"
              onClick={() => setShowCommentForm(true)}
            >
              <BiCommentDetail /> Add a Comment
            </button>
          )}
          
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <div className="comment-author">{comment.name}</div>
                  <div className="comment-date">
                    {formatDate(comment.created_at)}
                  </div>
                </div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-actions">
                  <button 
                    className={`comment-like ${likedComments.has(comment.id) ? 'liked' : ''}`}
                    onClick={() => handleLikeClick(comment.id)}
                    disabled={likingInProgress.has(comment.id)}
                  >
                    <BiLike /> {likingInProgress.has(comment.id) ? 'Updating...' : `Like (${comment.likes || 0})`}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail; 