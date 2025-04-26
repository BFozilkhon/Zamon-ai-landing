import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaUpload, FaTimes, FaCheck } from 'react-icons/fa';
import '../../styles/admin/ArticleManager.css';
import articleService from '../../services/articleService';

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== undefined;
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [article, setArticle] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
    featuredImage: '',
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          
          const articleData = await articleService.getArticleById(id);
          setArticle(articleData);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching article:', err);
          setError('Failed to load article. Please try again later.');
          setLoading(false);
        }
      };
      
      fetchArticle();
    }
  }, [id, isEditing]);

  useEffect(() => {
    // Auto-generate slug from title
    if (article.title && !isEditing) {
      setArticle(prev => ({
        ...prev,
        slug: prev.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-')
      }));
    }
  }, [article.title, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      return;
    }
    
    // Validate file size (limit to 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      setError('Image file is too large. Maximum size is 5MB.');
      return;
    }
    
    try {
      setImageUploading(true);
      setError(null);
      
      const imageUrl = await articleService.uploadImage(file);
      
      if (!imageUrl) {
        throw new Error('Failed to get image URL after upload');
      }
      
      setArticle(prev => ({
        ...prev,
        featuredImage: imageUrl
      }));
      
      setImageUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Development mode message vs production error message
      if (process.env.NODE_ENV === 'development') {
        setError('Note: In development mode, a placeholder image is used instead of actual uploads.');
      } else {
        setError('Failed to upload image: ' + (error.message || 'Unknown error'));
      }
      
      setImageUploading(false);
    }
  };

  const removeFeaturedImage = () => {
    setArticle(prev => ({
      ...prev,
      featuredImage: ''
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !article.tags.includes(newTag.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    // Validate required fields
    if (!article.title || !article.slug || !article.content) {
      setError('Please fill in all required fields');
      setSaving(false);
      return;
    }
    
    try {
      let savedArticle;
      
      if (isEditing) {
        // Update existing article
        savedArticle = await articleService.updateArticle(id, article);
        console.log('Article updated in Supabase:', savedArticle);
      } else {
        // Create new article
        savedArticle = await articleService.createArticle(article);
        console.log('Article created in Supabase:', savedArticle);
      }
      
      setSuccess(true);
      setSaving(false);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/admin/articles?message=' + encodeURIComponent(
          isEditing ? 'Article updated successfully' : 'Article created successfully'
        ));
      }, 1500);
    } catch (error) {
      console.error('Error saving article to Supabase:', error);
      setError('Failed to save article. Please check your Supabase connection.');
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading article...</div>;
  }

  return (
    <div className="article-editor">
      <div className="admin-section-header">
        <h2>{isEditing ? 'Edit Article' : 'Create New Article'}</h2>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">Article saved successfully!</div>}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="dev-mode-notice">
          <p>Development Mode: Images will be replaced with placeholders</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={article.title}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={article.slug}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={article.excerpt}
            onChange={handleChange}
            className="admin-textarea"
            rows="2"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={article.content}
            onChange={handleChange}
            className="admin-textarea"
            rows="10"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={article.category}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={article.status}
              onChange={handleChange}
              className="admin-select"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          <div className="featured-image-container">
            {imageUploading ? (
              <div className="image-uploading">
                <div className="loading-spinner"></div>
                <span>Uploading image...</span>
              </div>
            ) : article.featuredImage ? (
              <div className="image-preview">
                <img src={article.featuredImage} alt="Featured" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={removeFeaturedImage}
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="image-upload">
                <label htmlFor="featured-image" className="upload-label">
                  <FaUpload /> Upload Image
                </label>
                <input
                  type="file"
                  id="featured-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tags-input-container">
            <div className="tags-list">
              {article.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => removeTag(tag)}
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
            <div className="add-tag-input">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag..."
                className="admin-input"
              />
              <button
                type="button"
                className="add-tag-btn"
                onClick={addTag}
              >
                <FaCheck />
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="admin-button secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="admin-button primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : (
              <>
                <FaSave /> {isEditing ? 'Update' : 'Save'} Article
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor; 