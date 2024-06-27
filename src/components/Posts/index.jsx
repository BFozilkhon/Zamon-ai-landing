import React from 'react';

import PostCard from './card/postCard';

import img1 from '../../assets/images/posts.jpeg';
import img2 from '../../assets/images/post2.webp';
import img3 from '../../assets/images/post3.jpg';

import './style.css';

const Posts = () => {
  return (
    <div className='posts-container'>
      <h1 className='posts-header'>Article and News</h1>
      <p className='posts-descr'>News, tips, tricks and more</p>
      <div className='posts-cards'>
        <PostCard img={img3} />
        <PostCard img={img2} />
        <PostCard img={img1} />
      </div>
      <button className='posts-btn'>See More</button>
    </div>
  );
};

export default Posts;
