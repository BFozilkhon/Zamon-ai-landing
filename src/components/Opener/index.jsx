import React from 'react';

import openerImg from '../../assets/images/opener.png';

import './style.css';

const Opener = () => {
  return (
    <div className='opener-container'>
      <div className='opener-wrapper'>
        <div data-aos='fade-up-right' className='opener-box1'>
          <h3 data-aos='fade-up-right' className='opener-prompt'>
            Sun'iy Intellekt bo'yicha maqolalar
          </h3>
          <h1 data-aos='fade-up' className='opener-title'>
            Sun'iy intellekt Maqolalar & Hakatonlar
          </h1>
          <p data-aos='fade-up' className='opener-descr'>
            Maqsadimiz postlarimiz va eventlarimiz orqali maktab
            o’quvchilarining kompyuter fanlari va Sun’iy Intellekt ga yanada
            kengroq miqyosda qiziqishlarini rivojlantirishga yordam berishdir.
          </p>
          <div data-aos='fade-up' className='opener-btn-flex'>
            <a className='opener-link' href='#purpose'>
              <button className='opener-btn'>Boshlash</button>
            </a>
            <a
              className='opener-link'
              target='_blank'
              rel='noreferrer'
              href='https://docs.google.com/forms/d/1T6Ef1fnxQU72cpc0rozwlh4SWrpenu7G0Fe8LHohTqY/edit'
            >
              <button className='opener-btn'>Registratsiya</button>
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
