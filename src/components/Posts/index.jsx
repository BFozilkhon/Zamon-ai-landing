import React from 'react';
import { Link } from 'react-router-dom';
import Articles from '../Articles';
import './style.css';

const Posts = () => {
  return (
    <div id="news" className="posts-container">
      {/* <img className='detail1' src={detail1} alt='detail-1' /> */}
      <h1 data-aos="fade-up" className="posts-header">
         <span>Maqolalar va Yangiliklar</span>
      </h1>
      <p data-aos="fade-up" className="posts-descr">
        News, tips, tricks and more
      </p>
      
      <div className="posts-content">
        <Articles limit={6} />
      </div>
      
      <Link to="/posts">
        <button data-aos="fade-up" className="posts-btn">
          See More
        </button>
      </Link>
    </div>
  );
};

export default Posts;
