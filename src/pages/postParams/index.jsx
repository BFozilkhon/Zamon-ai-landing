import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArticleDetail from '../../components/ArticleDetail';
import articleService from '../../services/articleService';
import './style.css';

const PostParams = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch article from Supabase
        const articleData = await articleService.getArticleById(id);
        console.log('Article fetched from Supabase:', articleData);
        
        // Check if article exists and is published
        if (!articleData) {
          setError('Article not found');
          setLoading(false);
          return;
        }
        
        if (articleData.status !== 'published') {
          console.log('Article is not published, redirecting to posts page');
          navigate('/posts');
          return;
        }
        
        // Transform data to match the expected format for ArticleDetail
        const formattedArticle = {
          ...articleData,
          author: articleData.author || 'Admin',
          comments: articleData.comments || [],
          date: articleData.createdAt,
          type: articleData.category,
          description: articleData.content,
          img: articleData.featuredImage,
          featuredImage: articleData.featuredImage
        };
        
        setArticle(formattedArticle);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching article from Supabase:", err);
        setError('Failed to load article. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, navigate]);

  if (loading) {
    return <div className="article-loading">Loading article...</div>;
  }

  if (error || !article) {
    return <div className="article-not-found">
      {error || 'Article not found'}
    </div>;
  }

  return (
    <div className="post-params-page">
      <ArticleDetail article={article} />
    </div>
  );
};

export default PostParams;
