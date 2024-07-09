import React, { useEffect, useState } from 'react';

import postsData from '../../assets/fake_data/posts_data';
import PostCard from '../../components/Posts/card/postCard';

import './style.css';

const PostsPage = () => {
  const [data, setData] = useState(postsData);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/posts')
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((res) => console.log(res));
  }, []);

  return (
    <div className='posts-container'>
      {/* <img className='detail1' src={detail1} alt='detail-1' /> */}
      <h1 data-aos='fade-up' className='posts-header'>
        Maqolalar <span>va Yangiliklar</span>
      </h1>
      <p data-aos='fade-up' className='posts-descr'>
        Bu sahifa maqolalar, so'nggi yangiliklar va texnologiyalar bilan bog'liq
        ma'lumotlarni o'z ichiga oladi{' '}
      </p>
      <div className='posts-cards'>
        {data?.map((value, index) => {
          return <PostCard key={value.id} data={value} index={index + 1} />;
        })}
      </div>
    </div>
  );
};

export default PostsPage;
