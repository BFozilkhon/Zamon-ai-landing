import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiCalendar, BiTag, BiUser, BiComment } from 'react-icons/bi';
import './style.css';

// Base64 encoded simple SVG placeholder
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzIyM2QwZCIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiM5ZmU4NzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

const Article = ({ article, isFeatured = false }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Format date for consistent display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString; // Fall back to original string if date is invalid
    }
  };

  // Ensure excerpt has a reasonable length
  const getExcerpt = () => {
    if (article.excerpt) {
      return article.excerpt.length > 150 
        ? `${article.excerpt.substring(0, 150)}...` 
        : article.excerpt;
    }
    if (article.description) {
      return article.description.length > 150 
        ? `${article.description.substring(0, 150)}...` 
        : article.description;
    }
    return '';
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

  return (
    <div className={`article-card ${isFeatured ? 'featured' : ''}`} data-aos="fade-up">
      <div className={`article-image-container ${imageLoading ? 'loading' : ''}`}>
        {imageLoading && (
          <div className="image-loading-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img 
          src={getImageSource()}
          alt={article.title} 
          className={`article-image ${imageError ? 'error' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {article.category && (
          <span className="article-category">{article.category}</span>
        )}
      </div>
      
      <div className="article-content">
        <div className="article-meta">
    
          {article.author && (
            <span className="article-author">
              <BiUser className="article-icon" />
              {article.author}
            </span>
          )}
          {article.type && article.type !== article.category && (
            <span className="article-type">
              <BiTag className="article-icon" />
              {article.type}
            </span>
          )}
          {article.comments && article.comments.length > 0 && (
            <span className="article-comments">
              <BiComment className="article-icon" />
              {article.comments.length}
            </span>
          )}
        </div>
        
        <h3 className="article-title">{article.title}</h3>
        <p className="article-excerpt">{getExcerpt()}</p>
        
        <div className="article-actions">
          <Link to={`/post/${article.id}`} className="article-read-more">
            Read More
          </Link>
          {article.tags && article.tags.length > 0 && (
            <div className="article-tags">
              {article.tags.slice(0, 2).map((tag, index) => (
                <Link key={index} to={`/posts?tag=${tag}`} className="article-tag">
                  #{tag}
                </Link>
              ))}
              {article.tags.length > 2 && (
                <span className="article-tag">+{article.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article; 