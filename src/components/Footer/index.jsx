import React from 'react';
import { FaTelegram, FaInstagram } from 'react-icons/fa';

import logo from '../../assets/images/opener.png';

import './style.css';

const Footer = () => {
  return (
    <footer className='footer-container'>
      <div className='footer-content'>
        <img src={logo} alt='logo' className='footer-logo' />
        <div className='footer-links'>
          <a href='#home'>Asosiy</a>
          <a href='#hackathon'>Hakaton</a>
          <a href='#news'>Maqolalar</a>
          <a href='#team'>Jamoa</a>
          <a href='#faq'>FAQ</a>
        </div>
        <div className='footer-social'>
          <a
            href='https://t.me/zamon_ai'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaTelegram />
          </a>
          <a
            href='https://www.instagram.com/zamon_ai'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
