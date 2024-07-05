import React from 'react';

import openerImg from '../../assets/images/opener.png';

import './style.css';

const Opener = () => {
  return (
    <div className='opener-container'>
      <div className='opener-wrapper'>
        <div data-aos='fade-up-right' className='opener-box1'>
          <h3 data-aos='fade-up-right' className='opener-prompt'>
            First AI Project in Uzbekistan
          </h3>
          <h1 data-aos='fade-up' className='opener-title'>
            Artificial intelligence & Cyber security
          </h1>
          <p data-aos='fade-up' className='opener-descr'>
            Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries for previewing layouts and visual mockups.
          </p>
          <div data-aos='fade-up' className='opener-btn-flex'>
            <a className='opener-link' href='#news'>
              <button className='opener-btn'>Get Started</button>
            </a>
            <a
              className='opener-link'
              target='_blank'
              href='https://docs.google.com/forms/d/1C9jK9pXhVOamv8qpMeS8yNBxkOzzEWlEyST6vWQ33oI/edit'
            >
              <button className='opener-btn'>Register</button>
            </a>
          </div>
        </div>
        <div className='opener-box2'>
          <img
            data-aos='fade-up-left'
            className='opener-img'
            src={openerImg}
            alt='opener-img'
          />
        </div>
      </div>
    </div>
  );
};

export default Opener;
