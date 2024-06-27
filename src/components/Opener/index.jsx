import React from 'react';

import openerImg from '../../assets/images/opener.png';

import './style.css';

const Opener = () => {
  return (
    <div className='opener-container'>
      <div className='opener-wrapper'>
        <div className='opener-box1'>
          <h3 className='opener-prompt'>First AI Project in Uzbekistan</h3>
          <h1 className='opener-title'>
            Artificial intelligence & Cyber security
          </h1>
          <p className='opener-descr'>
            Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries for previewing layouts and visual mockups.
          </p>
          <div className='opener-btn-flex'>
            <button className='opener-btn'>Get Started</button>
            <button className='opener-btn'>Subscribe</button>
          </div>
        </div>
        <div className='opener-box2'>
          <img src={openerImg} alt='opener-img' />
        </div>
      </div>
    </div>
  );
};

export default Opener;
