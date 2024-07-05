import React, { useEffect, useState } from 'react';

import PostCard from './card/postCard';

import postsData from '../../assets/fake_data/posts_data';

import './style.css';
import { Link } from 'react-router-dom';

const Posts = () => {
  const [data, setData] = useState(postsData.slice(0, 6));

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/posts')
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((res) => console.log(res));
  }, []);

  return (
    <div id='news' className='posts-container'>
      {/* <img className='detail1' src={detail1} alt='detail-1' /> */}
      <h1 data-aos='fade-up' className='posts-header'>
        Article <span>and News</span>
      </h1>
      <p data-aos='fade-up' className='posts-descr'>
        News, tips, tricks and more
      </p>
      <div className='posts-cards'>
        {data?.map((value, index) => {
          return <PostCard key={value.id} data={value} index={index + 1} />;
        })}
      </div>
      <Link to='/posts'>
        <button data-aos='fade-up' className='posts-btn'>
          See More
        </button>
      </Link>
    </div>
  );
};

export default Posts;
