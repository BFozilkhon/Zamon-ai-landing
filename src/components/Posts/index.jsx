import React from 'react';

import PostCard from './card/postCard';

import img1 from '../../assets/images/posts.jpeg';
import img2 from '../../assets/images/post2.webp';
import img3 from '../../assets/images/post3.jpg';

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
        <PostCard animate='fade-right' img={img3} />
        <PostCard animate='fade-left' img={img2} />
        <PostCard animate='fade-right' img={img1} />
      </div>
      <button data-aos='fade-up' className='posts-btn'>
        See More
      </button>
    </div>
  );
};

export default Posts;
