import React from 'react';

import PostCard from './card/postCard';

import postsData from '../../assets/fake_data/posts_data';

import './style.css';

const Posts = () => {
  return (
    <div className='posts-container'>
      <h1 data-aos='fade-up' className='posts-header'>
        Article and News
      </h1>
      <p data-aos='fade-up' className='posts-descr'>
        News, tips, tricks and more
      </p>
      <div className='posts-cards'>
        {postsData?.map((value, index) => {
          return <PostCard key={value.id} data={value} index={index + 1} />;
        })}
      </div>
      <button data-aos='fade-up' className='posts-btn'>
        See More
      </button>
    </div>
  );
};

export default Posts;
