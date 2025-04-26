import React, { useEffect, useState } from 'react';
import { Turn } from 'hamburger-react';

import logo from '../../assets/images/logo.jpg';

import './style.css';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [locationName, setLocationName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isOpen && windowWidth < 920) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  const location = useLocation();

  useEffect(() => {
    if (location.hash === `#${locationName}`) {
      const openerElement = document.getElementById(locationName);
      openerElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [locationName]);

  return (
    <div id='home' className='nav-container'>
      <div className='nav-wrapper'>
        <div className='nav-box'>
          <Link to='/'>
            <h1 className='logo-head'>ZAMONAI.</h1>
          </Link>
          <div className={`nav-items ${isOpen && 'open'}`}>
            <Link
              onClick={() => {
                setIsOpen(!isOpen);
                setLocationName('home');
              }}
              to='/#home'
              className='nav-item'
            >
              Asosiy
            </Link>
            {/* <a href='#' className='nav-item'>
              Hackathon
            </a> */}
            <Link
              onClick={() => {
                setIsOpen(!isOpen);
                setLocationName('news');
              }}
              to='/#news'
              className='nav-item'
            >
              Yangiliklar
            </Link>
            {/* <Link
              onClick={() => {
                setIsOpen(!isOpen);
                setLocationName('team');
              }}
              to='/#team'
              className='nav-item'
            >
              Jamoa
            </Link> */}
            <Link
              onClick={() => {
                setIsOpen(!isOpen);
                setLocationName('faq');
              }}
              to='/#faq'
              className='nav-item'
            >
              FAQ
            </Link>
            <Link
              onClick={() => {
                setIsOpen(!isOpen);
                setLocationName('contact');
              }}
              to='/#contact'
              className='nav-item contact'
            >
              Aloqa
            </Link>
          </div>
        </div>
        <div className='flex-btn-menu'>
          <Turn toggled={isOpen} toggle={setIsOpen} />
          <a href='#contact'>
            <button className='nav-btn'>Contact</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
