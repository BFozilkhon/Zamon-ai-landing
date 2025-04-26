import React from 'react';
import { Helmet } from 'react-helmet';
import Articles from '../../components/Articles';
import './style.css';
import { isDevMode } from '../../services/supabase';

const PostsPage = () => {
  return (
    <div className='posts-page'>
      <Helmet>
        <title>Posts | ZamonAI</title>
        <meta name="description" content="ZamonAI News and Articles" />
      </Helmet>
      
      <div className='posts-page-header'>
        <h1 className='posts-page-title'>
          {isDevMode ? 'Articles (Development Mode)' : 'Articles & News'}
        </h1>
        {isDevMode && (
          <p className='dev-mode-notice'>
            You're viewing mock articles in development mode. These are not real articles.
          </p>
        )}
      </div>
      
      <Articles />
    </div>
  );
};

export default PostsPage;
