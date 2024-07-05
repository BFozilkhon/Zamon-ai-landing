import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import postsData from '../../assets/fake_data/posts_data';

import './style.css';

const PostParams = () => {
  const [data, setData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const filteredData = postsData.filter((value) => value.id === parseInt(id));
    console.log(filteredData, 'filter');
    setData(filteredData[0]);
  }, []);

  return (
    <div className='post-params-container'>
      <div className='post-params-box1'>
        <img className='post-params-img' src={data?.img} alt='img' />
        <div className='post-params-flex'>
          <p className='post-params-prompt'>{data?.type}</p>
          <p className='post-params-prompt'>{data?.date}</p>
        </div>
        <h1 className='post-params-title'>{data?.title}</h1>
        {data?.description?.split('\br').map((paragraph, index) => (
          <>
            {console.log(paragraph, 'pp')}
            <i key={index} className='post-params-descr'>
              {paragraph}
            </i>
            <br />
            <br />
          </>
        ))}
      </div>
    </div>
  );
};

export default PostParams;
