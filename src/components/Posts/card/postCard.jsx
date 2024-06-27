import React from 'react';



import './postCard.css';

const PostCard = ({ img }) => {
  return (
    <div className='posts-card'>
      <img className='posts-card-img' src={img} alt='posts-card-img1' />
      <p className='posts-card-prompt'>PODCAST</p>
      <h3 className='posts-card-title'>Setup your own podcast</h3>
      <p className='posts-card-descr'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minimvel
        iam, quis nostrud exercitation ullamco laboris...
      </p>
      <hr className='posts-card-line' />
      <div className='posts-card-flex'>
        <div className='posts-card-btn-flex'>
          <button className='posts-card-btn'>More...</button>
          <button className='posts-card-btn'>Share</button>
        </div>
        <p className='posts-card-date'>Sep 14, 2021</p>
      </div>
    </div>
  );
};

export default PostCard;
