import React from 'react';

import './postCard.css';

const PostCard = ({ data, index }) => {
  return (
    <div
      data-aos={index % 2 == 0 ? 'fade-left' : 'fade-right'}
      className='posts-card'
    >
      <img className='posts-card-img' src={data?.img} alt='posts-card-img1' />
      <div className='posts-detail-flex'>
        <p className='posts-card-prompt'>{data?.type}</p>
        <p className='posts-card-date-mobile'>{data?.date}</p>
      </div>
      <h3 className='posts-card-title'>{data?.title}</h3>

      <p className='posts-card-descr'>{data?.description}</p>
      <div className='posts-bottom-wrapper'>
        <hr className='posts-card-line' />
        <div className='posts-card-flex'>
          <div className='posts-card-btn-flex'>
            <button className='posts-card-btn'>More...</button>
            <button className='posts-card-btn'>Share</button>
          </div>
          <p className='posts-card-date-laptop'>{data?.date}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
