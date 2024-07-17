import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

import targetImg from '../../assets/images/target.png';

import './style.css';

const Hackathon = () => {
  return (
    <div id='hackathon' data-aos='fade-up' className='hack-container'>
      <div className='hack-wrapper'>
        <p className='hack-prompt'>Target International School x Zamon AI</p>
        <h1 className='hack-header'>TeenHack Hakaton 2024</h1>
        <p className='hack-descr'>
          🚀 Salom, <span className='hack-txt-mark'>Maktab o'quvchilari</span>{' '}
          uchun maxsus TeenHack 2024 hakatoni uchun registratsiya{' '}
          <span className='hack-txt-mark'>25-Iyul 23:59 </span>
          gacha davom etadi, Hackathon ni o'zi esa{' '}
          <span className='hack-txt-mark'>27-28-29-Iyul </span> kunlari bo'lib
          o'tadi.
          <br />
          <br />
          🏆 Sovg'alarni eslatib o'tamiz:
          <br />
          <br />
          1-O'rin: <span className='hack-txt-mark'>5 Million So'm</span>
          <br />
          2-O'rin: <span className='hack-txt-mark'>3 Million So'm</span>
          <br />
          3-O'rin: <span className='hack-txt-mark'>2 Million So'm</span>
          <br />
          <br />
          ✨Registratsiya qiling va bir necha yutuqlardan bittasini yutib oling.
          Biz sizga ishonamiz!
        </p>

        <a
          href='https://docs.google.com/forms/d/1T6Ef1fnxQU72cpc0rozwlh4SWrpenu7G0Fe8LHohTqY/viewform?edit_requested=true'
          target='_blank'
        >
          <button className='hack-btn'>
            Registratsiya
            <MdArrowOutward className='hack-icon' />
          </button>
        </a>

        <img src={targetImg} alt='target' className='hack-img' />
      </div>
    </div>
  );
};

export default Hackathon;
