import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Article from '../Article';
import { BiSearch, BiFilterAlt } from 'react-icons/bi';
import articleService from '../../services/articleService';
import './style.css';

const Articles = ({ limit = 0, featured = false }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlTag = searchParams.get('tag');
  const urlCategory = searchParams.get('category');
  
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    tag: urlTag || '',
    category: urlCategory || '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const articlesPerPage = 6;

  // Fetch articles from Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      
      try {
        // Get articles from Supabase
        const result = await articleService.getArticles({
          status: 'published'  // Only show published articles
        });
        
        console.log('Articles fetched for public view:', result);
        
        if (result && result.articles) {
          // Process the articles
          setArticles(result.articles);
          
          // Extract all unique categories and tags
          const allCategories = [...new Set(result.articles.map(article => article.category).filter(Boolean))];
          const allTags = [...new Set(result.articles.flatMap(article => article.tags || []))];
          
          setCategories(allCategories);
          setTags(allTags);
        } else {
          setArticles([]);
          setCategories([]);
          setTags([]);
        }
      } catch (error) {
        console.error("Error loading articles from Supabase:", error);
        setError("Failed to load articles. Please try again later.");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let results = [...articles];
    
    // Apply category filter
    if (activeFilters.category) {
      results = results.filter(article => 
        article.category === activeFilters.category
      );
    }
    
    // Apply tag filter
    if (activeFilters.tag) {
      results = results.filter(article => 
        article.tags && article.tags.includes(activeFilters.tag)
      );
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(article => 
        article.title.toLowerCase().includes(searchLower) || 
        (article.content && article.content.toLowerCase().includes(searchLower)) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply limit if specified
    const finalResults = limit > 0 ? results.slice(0, limit) : results;
    
    setFilteredArticles(finalResults);
    setCurrentPage(1);
  }, [articles, activeFilters, search, limit]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveFilters({
      tag: '',
      category: '',
    });
    setSearch('');
  };

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // If loading
  if (loading) {
    return <div className="articles-loading">Loading articles...</div>;
  }

  // If no articles found
  if (filteredArticles.length === 0) {
    return (
      <div className="articles-empty">
        <h3>No articles found</h3>
        {(search || activeFilters.category || activeFilters.tag) ? (
          <p>Try adjusting your filters or search criteria</p>
        ) : (
          <p>Create some articles in the admin panel to see them here</p>
        )}
        {(search || activeFilters.category || activeFilters.tag) && (
          <button className="button-reset" onClick={resetFilters}>Reset Filters</button>
        )}
      </div>
    );
  }

  return (
    <div className="articles-container">
      {/* Search and Filter Controls */}
      <div className="articles-controls">
        <div className="search-box">
          <BiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search articles..." 
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        {categories.length > 0 && (
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <BiFilterAlt /> Filters
          </button>
        )}
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel" data-aos="fade-down">
          {categories.length > 0 && (
            <div className="filter-section">
              <h4>Categories</h4>
              <div className="filter-options">
                {categories.map((category) => (
                  <button 
                    key={category}
                    className={`filter-button ${activeFilters.category === category ? 'active' : ''}`}
                    onClick={() => handleFilterChange('category', activeFilters.category === category ? '' : category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {tags.length > 0 && (
            <div className="filter-section">
              <h4>Tags</h4>
              <div className="filter-options">
                {tags.map((tag) => (
                  <button 
                    key={tag}
                    className={`filter-button tag ${activeFilters.tag === tag ? 'active' : ''}`}
                    onClick={() => handleFilterChange('tag', activeFilters.tag === tag ? '' : tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button className="button-reset" onClick={resetFilters}>Reset Filters</button>
        </div>
      )}
      
      {/* Articles Grid */}
      <div className="articles-grid">
        {featured && filteredArticles.length > 0 && (
          <Article article={filteredArticles[0]} isFeatured={true} />
        )}
        
        {(featured ? currentArticles.slice(1) : currentArticles).map((article) => (
          <Article key={article.id} article={article} />
        ))}
      </div>
      
      {/* Pagination */}
      {!limit && totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            Prev
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(num => Math.abs(num - currentPage) < 3 || num === 1 || num === totalPages)
            .map((number) => {
              if (Math.abs(number - currentPage) === 3 && number !== 1 && number !== totalPages) {
                return <span key={`ellipsis-${number}`} className="pagination-ellipsis">...</span>;
              }
              return (
                <button
                  key={number}
                  className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              );
            })}
          
          <button 
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Articles; 