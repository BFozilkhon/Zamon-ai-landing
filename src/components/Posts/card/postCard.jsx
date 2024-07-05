import React from 'react';

import './postCard.css';
import { Link } from 'react-router-dom';

const PostCard = ({ data, index }) => {
  return (
    <div
      data-aos={index % 2 == 0 ? 'fade-left' : 'fade-right'}
      className='posts-card'
    >
      <img
        className='posts-card-img'
        src={`${data?.img}`}
        alt='posts-card-img1'
      />
      <div className='posts-detail-flex'>
        <p className='posts-card-prompt'>{data?.type}</p>
        <p className='posts-card-date-mobile'>{data?.date?.slice(0, 10)}</p>
      </div>
      <h3 className='posts-card-title'>{data?.title}</h3>

      <p className='posts-card-descr'>{data?.description.slice(0, 150)}...</p>
      <div className='posts-bottom-wrapper'>
        <hr className='posts-card-line' />
        <div className='posts-card-flex'>
          <div className='posts-card-btn-flex'>
            <Link className='posts-link' to={`/post/${data?.id}`}>
              <button className='posts-card-btn'>{data?.views} More </button>
            </Link>
            <button className='posts-card-btn'>
              Share {data?.share_count}
            </button>
          </div>
          <p className='posts-card-date-laptop'>{data?.date.slice(0, 10)}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
