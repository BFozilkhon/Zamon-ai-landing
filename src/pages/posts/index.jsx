import React from 'react';
import Articles from '../../components/Articles';
import './style.css';

const PostsPage = () => {
  return (
    <div className="posts-page-container">
      <div className="posts-page-header">
        <h1 className="posts-page-title" data-aos="fade-up">Articles and News</h1>
        <p className="posts-page-description" data-aos="fade-up">
          Explore the latest insights, tutorials, and news about AI and technology
        </p>
      </div>
      
      <Articles featured={true} />
    </div>
  );
};

export default PostsPage;
