import React from 'react';
import { FaBrain, FaUsers, FaLaptopCode, FaHandsHelping } from 'react-icons/fa';

import './style.css';

const Purpose = () => {
  return (
    <div className='purpose-container'>
      <div className='purpose-wrapper'>
        <h1 data-aos='fade-up' className='purpose-header'>
           <span>Maqsad & Kelajak</span>
        </h1>
        <p data-aos='fade-up' className='purpose-descr'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam,
          quas!
        </p>
        <div data-aos='fade-up' className='purpose-box'>
          
          <div className='purpose-card'>
            <div className='purpose-circle'>
              <FaUsers className='purpose-icon' />
            </div>
            <h3 className='purpose-card-title'>Bizning Maqsadimiz</h3>
            <i className='purpose-card-descr'>
            Bugungi texnologiyalar dunyosida AI - bu oddiy so‘z emas. Bu - kelajak. Ammo ko‘pchilik hali ham bu sohani chuqur tushunmaydi. Biz Zamon AI orqali shu muammoni hal qilishga bel bog'ladik. 
Zamon AI - bu O‘zbekistonda AI haqida eng yirik platformani yaratish yo‘lida boshlangan proyek
            </i>
          </div>
         
          <div className='purpose-card'>
            <div className='purpose-circle'>
              <FaHandsHelping className='purpose-icon' />
            </div>
            <h3 className='purpose-card-title'>Bizning Ta'limimiz</h3>
            <i className='purpose-card-descr'>
            • O‘zbek tilida AI bo‘yicha kuchli, zamonaviy, tushunarli kontentlar yaratish
• YouTube, Instagram, Telegram, va veb-platformamiz orqali millionlab yoshlar uchun eshik ochish
• Sun’iy intellekt, AI marketing, avtomatlashtirish, e-commerce, freelancing, dizayn, real estate, startup kabi zamonaviy sohalarda kurslar, maqolalar, podkastlar va video darsliklar
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purpose;
