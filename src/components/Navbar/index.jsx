import React from 'react';

import logo from '../../assets/images/logo.jpg';

import './style.css';

const Navbar = () => {
  return (
    <div className='nav-container'>
      <div className='nav-wrapper'>
        <div className='nav-box'>
          <h1 className='logo-head'>ZAMONAI.</h1>
          {/* <img src={logo} alt='logo' className='nav-logo' /> */}
          <div className='nav-items'>
            <a href='#' className='nav-item'>
              Home
            </a>
            <a href='#' className='nav-item'>
              Hackathon
            </a>
            <a href='#' className='nav-item'>
              News
            </a>
            <a href='#' className='nav-item'>
              Team
            </a>
            <a href='#' className='nav-item'>
              FAQ
            </a>
          </div>
        </div>
        <button className='nav-btn'>Contact</button>
      </div>
    </div>
  );
};

export default Navbar;
