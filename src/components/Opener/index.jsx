import React from 'react';
import zamonaiImg from '../../assets/images/zamonai.png';
import './style.css';

const Opener = () => {
  return (
    <div className='opener-container'>
      <div className='opener-wrapper'>
        <div className='opener-box1'>
          <h3 className='opener-prompt'>
            O'zbekistondagi Sun'iy Intellekt va Tehnologiyalar platformasi
          </h3>
          <h1 className='opener-title'>
      Sun'iy Intellekt va Texnologiyalar
          </h1>
          <p className='opener-descr'>
          AI va zamonaviy kasblar bo‘yicha eng yirik o‘zbek tilidagi platforma!
Biz bilan:
• Sun’iy intellekt asoslari
• Kontent yaratish, marketing, freelancing
• Kurslar, maqolalar, podkastlar
• Real imkoniyatlar,real natijalar
          </p>
          <div className='opener-btn-flex'>
            <a className='opener-link' href='#news'>
              <button className='opener-btn'>Boshlash</button>
            </a>
            <a
              className='opener-link'
              target='_blank'
              href='https://docs.google.com/forms/d/1C9jK9pXhVOamv8qpMeS8yNBxkOzzEWlEyST6vWQ33oI/edit'
            >
            </a>
          </div>
        </div>
        <div className='opener-box2'>
          <img
            className='opener-img'
            src={zamonaiImg}
            alt='zamonai-logo'
            style={{ 
              width: '120%',
              height: 'auto',
              opacity: 0.9,
              objectFit: 'contain',
              marginLeft: '-10%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Opener;
