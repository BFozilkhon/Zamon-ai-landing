import React from 'react';
import { FaTelegram, FaInstagram, FaLinkedin } from 'react-icons/fa';

import logo from '../../assets/images/opener.png';

import './style.css';

const Footer = () => {
  return (
    <footer className='footer-container'>
      <div className='footer-content'>
        <img src={logo} alt='logo' className='footer-logo' />
        <div className='footer-links'>
          <a href='#main'>Main</a>
          <a href='#hackathon'>Hackathon</a>
          <a href='#news'>News</a>
          <a href='#team'>Team</a>
          <a href='#faq'>FAQ</a>
        </div>
        <div className='footer-social'>
          <a
            href='https://telegram.org/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaTelegram />
          </a>
          <a
            href='https://instagram.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaInstagram />
          </a>
          <a
            href='https://linkedin.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaLinkedin />
          </a>
        </div>
        {/* <a href='https://telegram.me/yourusername' className='footer-message'>
          Send us a message
        </a> */}
      </div>
    </footer>
  );
};

export default Footer;
