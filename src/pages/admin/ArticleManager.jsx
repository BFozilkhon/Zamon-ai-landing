import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaCheckCircle, FaRegClock, FaInfoCircle, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import '../../styles/admin/ArticleManager.css';
import articleService from '../../services/articleService';

const ArticleManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Selection
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  
  // Define fetchArticlesData function
  const fetchArticlesData = async () => {
    try {
      console.log('Fetching articles...');
      setLoading(true);
      setError(null);
      
      const result = await articleService.getArticles({
        page: currentPage,
        limit: articlesPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined
      });
      
      console.log('Articles fetched from API:', result);
      setArticles(result.articles || []);
      setTotalPages(result.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to fetch articles. Please check your Supabase connection.');
      setArticles([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load articles from Supabase
    fetchArticlesData();
  }, [currentPage, articlesPerPage, statusFilter, categoryFilter, searchTerm]);

  useEffect(() => {
    // Check for success message from article editing
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) {
      setSuccessMessage(message);
      // Clear message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        // Remove query parameter
        navigate('/admin/articles', { replace: true });
      }, 3000);
    }
  }, [location, navigate]);

  const handleAddNewArticle = () => {
    navigate('/admin/articles/new');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  };

  const deleteArticle = async (id) => {
    try {
      await articleService.deleteArticle(id);
      setShowDeleteModal(false);
      setArticleToDelete(null);
      setSuccessMessage('Article deleted successfully');
      
      // Refresh the article list
      fetchArticlesData();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('Failed to delete article. Please try again.');
      setShowDeleteModal(false);
      setArticleToDelete(null);
    }
  };

  // Filter articles based on search and filters
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

  // Fetch articles on component mount
  useEffect(() => {
    const loadInitialArticles = async () => {
      try {
        console.log('Loading initial articles data');
        setLoading(true);
        setError(null);
        
        const result = await articleService.getArticles();
        console.log('Initial articles:', result);
        setArticles(result.articles || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading initial articles:', err);
        setError('Failed to load articles. Please check your Supabase connection.');
        setLoading(false);
      }
    };

    loadInitialArticles();
  }, []);

  // Update pagination when filters or articles change
  useEffect(() => {
    // Calculate total pages based on filtered articles
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    setTotalPages(totalPages || 1);
  }, [filteredArticles, articlesPerPage, searchTerm, categoryFilter, statusFilter, currentPage]);

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (e) => {
    setArticlesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Get unique categories for filter dropdown
  const categories = [...new Set(articles.map(article => article.category))];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all filtered articles
      setSelectedArticles(filteredArticles.map(article => article.id));
    } else {
      // Deselect all
      setSelectedArticles([]);
    }
  };

  const handleSelectArticle = (id) => {
    if (selectedArticles.includes(id)) {
      // Deselect
      setSelectedArticles(selectedArticles.filter(articleId => articleId !== id));
    } else {
      // Select
      setSelectedArticles([...selectedArticles, id]);
    }
  };

  const handleBulkActionChange = (e) => {
    const action = e.target.value;
    setBulkAction(action);
    
    if (action === 'delete') {
      setShowBulkDeleteModal(true);
    } else if (action === 'publish' || action === 'draft') {
      handleBulkStatusChange(action);
    }
    
    // Reset select after action
    e.target.value = '';
  };

  const handleBulkStatusChange = async (status) => {
    if (selectedArticles.length === 0) return;
    
    try {
      setLoading(true);
      
      // Update each selected article
      for (const articleId of selectedArticles) {
        await articleService.updateArticle(articleId, { status });
      }
      
      // Refresh the article list
      await fetchArticlesData();
      
      // Show success message
      setSuccessMessage(`${selectedArticles.length} articles updated to "${status}" status.`);
      
      // Clear selection
      setSelectedArticles([]);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating article status:', err);
      setError('Failed to update articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) return;
    
    try {
      setLoading(true);
      
      // Delete each selected article
      for (const articleId of selectedArticles) {
        await articleService.deleteArticle(articleId);
      }
      
      // Refresh the article list
      await fetchArticlesData();
      
      // Show success message
      setSuccessMessage(`${selectedArticles.length} articles deleted successfully.`);
      
      // Close modal
      setShowBulkDeleteModal(false);
      
      // Clear selection
      setSelectedArticles([]);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting articles:', err);
      setError('Failed to delete articles. Please try again.');
      setShowBulkDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBulkDelete = () => {
    setShowBulkDeleteModal(false);
    setBulkAction('');
  };

  return (
    <div className="article-manager">
      <div className="admin-section-header">
        <h2>Article Management</h2>
        <div className="header-actions">
          <button 
            className="admin-button primary"
            onClick={handleAddNewArticle}
          >
            <FaPlus /> New Article
          </button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {successMessage && <div className="admin-success">{successMessage}</div>}

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="admin-input"
          />
        </div>
        
        <select 
          className="admin-select filter-select"
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        
        <select 
          className="admin-select filter-select"
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
        >
          <option value="all">All Categories</option>
          {categories.length > 0 && categories.map(category => (
            category && <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Loading articles...</div>
      ) : filteredArticles.length === 0 ? (
        <div className="no-articles">
          <p>No articles found. {searchTerm && 'Try adjusting your search criteria.'}</p>
          <button 
            className="admin-button primary" 
            style={{ marginTop: '16px' }}
            onClick={handleAddNewArticle}
          >
            <FaPlus /> Create Your First Article
          </button>
        </div>
      ) : (
        <>
          {/* Bulk actions */}
          <div className="bulk-actions-bar">
            <div className="selection-info">
              {selectedArticles.length > 0 ? (
                <span>{selectedArticles.length} articles selected</span>
              ) : (
                <span>Select articles to perform bulk actions</span>
              )}
            </div>
            <div className="bulk-actions">
              <select 
                className="admin-select bulk-select"
                value={bulkAction}
                onChange={handleBulkActionChange}
                disabled={selectedArticles.length === 0}
              >
                <option value="">Bulk Actions</option>
                <option value="publish">Set as Published</option>
                <option value="draft">Set as Draft</option>
                <option value="delete">Delete Selected</option>
              </select>
            </div>
          </div>
        
          <table className="articles-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={currentArticles.length > 0 && 
                      currentArticles.every(article => selectedArticles.includes(article.id))}
                    className="admin-checkbox"
                  />
                </th>
                <th>Article</th>
                <th>Category</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentArticles.map(article => (
                <tr key={article.id} className={selectedArticles.includes(article.id) ? 'selected' : ''}>
                  <td className="checkbox-column">
                    <input 
                      type="checkbox" 
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => handleSelectArticle(article.id)}
                      className="admin-checkbox"
                    />
                  </td>
                  <td>
                    <div className="article-title">{article.title}</div>
                    <div className="article-excerpt">{article.excerpt}</div>
                  </td>
                  <td>
                    <span className="article-category">{article.category}</span>
                  </td>
                  <td>
                    <span className={`article-status ${article.status}`}>
                      {article.status === 'published' ? (
                        <><FaCheckCircle /> Published</>
                      ) : (
                        <><FaRegClock /> Draft</>
                      )}
                    </span>
                  </td>
                  <td>{article.updatedAt}</td>
                  <td>
                    <div className="article-actions">
                      <button
                        className="action-button edit-button"
                        onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-button view-button"
                        onClick={() => navigate(`/post/${article.id}`)}
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDeleteClick(article)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <div className="pagination-info">
                Showing {(currentPage - 1) * articlesPerPage + 1} - {
                  Math.min(currentPage * articlesPerPage, filteredArticles.length)
                } of {filteredArticles.length} articles
              </div>
              <div className="pagination-actions">
                <div className="page-size-selector">
                  <label htmlFor="pageSize">Show:</label>
                  <select 
                    id="pageSize" 
                    className="admin-select"
                    value={articlesPerPage}
                    onChange={handlePageSizeChange}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="pagination-buttons">
                  <button 
                    className="pagination-button"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    title="First Page"
                  >
                    <span>1</span>
                  </button>
                  <button 
                    className="pagination-button prev"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Previous Page"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <span className="current-page">{currentPage} of {totalPages}</span>
                  
                  <button 
                    className="pagination-button next"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                  >
                    <FaChevronRight />
                  </button>
                  <button 
                    className="pagination-button"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    title="Last Page"
                  >
                    <span>{totalPages}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && articleToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button className="modal-close" onClick={handleCancelDelete}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the article "{articleToDelete.title}"?</p>
              <p className="modal-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="admin-button secondary" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="admin-button delete" onClick={() => deleteArticle(articleToDelete.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Bulk Deletion</h3>
              <button className="modal-close" onClick={handleCancelBulkDelete}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="bulk-delete-warning">
                <FaInfoCircle className="warning-icon" />
                <div>
                  <p>You are about to delete <strong>{selectedArticles.length}</strong> articles.</p>
                  <p className="modal-warning">This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-button secondary" onClick={handleCancelBulkDelete}>
                Cancel
              </button>
              <button className="admin-button delete" onClick={handleBulkDelete}>
                Delete {selectedArticles.length} Articles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleManager;