import React from 'react';
import { FaBrain, FaUsers, FaLaptopCode, FaHandsHelping } from 'react-icons/fa';

import './style.css';

const Purpose = () => {
  return (
    <div id='purpose' className='purpose-container'>
      <div className='purpose-wrapper'>
        <h1 data-aos='fade-up' className='purpose-header'>
          Maqsad <span>& Kelajak</span>
        </h1>
        <p data-aos='fade-up' className='purpose-descr'>
          O‘zbekistonda AI va informatika fanlarini rivojlantirish va
          xilma-xillikni oshirish maqsadida bepul ZamonAI loyihasi
        </p>
        <div data-aos='fade-up' className='purpose-box'>
          <div className='purpose-card'>
            <div className='purpose-circle'>
              <FaBrain className='purpose-icon' />
            </div>
            <h3 className='purpose-card-title'>Bizning Kelajakimiz</h3>
            <i className='purpose-card-descr'>
              Kompyuter fanini universal tushunish hozirgi va kelajakdagi
              jamiyatimiz uchun zarur. Bugungi bolalar mehnatga qo'shilishlari
              bilan sun'iy intellekt kundalik hayotning asosiga aylanishi
              muqarrar. Atrofimizdagi har bir sohada sun'iy intellekt
              qo'llanilsa, uni tushunmaydiganlar noqulay ahvolga tushib
              qolishadi. Shuningdek, biz ko'plab sohalar va hayotga ta'sir
              qiladigan adolatli va xolis sun'iy intellektni ishlab chiqarish
              uchun AI sohasida xilma-xillik va vakillikni oshirishimiz
              kerakligini ham tushunamiz.
            </i>
          </div>
          <div className='purpose-card'>
            <div className='purpose-circle'>
              <FaUsers className='purpose-icon' />
            </div>
            <h3 className='purpose-card-title'>Bizning Missiyamiz </h3>
            <i className='purpose-card-descr'>
              Maqsadimiz O‘zbekistondagi turli millatga mansub talabalarga
              informatika fanini o‘rganish va allaqachon qiziqish uyg‘otayotgan
              talabalarga, xususan, AIga qiziqishlarini tasdiqlashdir. Ushbu
              tadbir uchun turli xil yollashimiz bilan biz kompyuter fanlari va
              AI kelajagini iloji boricha xilma-xil qilishga harakat qila
              olamiz. O‘rta va o‘rta maktabga qiziqish urug‘ini ekish orqali
              O‘zbekistonda kam ta’minlangan o‘quvchilar sun’iy intellekt va
              informatika bilan bog‘liq kasblarni egallashga ko‘proq
              rag‘batlantiriladi.{' '}
            </i>
          </div>
          <div className='purpose-card'>
            <div className='purpose-circle'>
              <FaLaptopCode className='purpose-icon' />
            </div>
            <h3 className='purpose-card-title'>Bizning Maqsadimiz</h3>
            <i className='purpose-card-descr'>
              Oʻzbekiston maktablarida nazariy informatika darslarining amaliy
              bilim yetishmasligini hal qilish uchun yetakchi
              IT-mutaxassislardan xakaton va mahorat darslarini oʻtkazamiz.
              Hackathonlar orqali o‘quvchilar haqiqiy muammolarni hal qilish
              uchun guruhlarda ishlaydi. Bu tajriba ularning amaliy va jamoaviy
              ko‘nikmalarini rivojlantiradi. Maqsadimiz ZamonAI loyihasi orqali
              kompyuter fanlari va sun'iy intellektga qiziqishni
              kengaytirishdir.
            </i>
          </div>
          <div className='purpose-card'>
            <div className='purpose-circle'>
              <FaHandsHelping className='purpose-icon' />
            </div>
            <h3 className='purpose-card-title'>Bizning Afzalliklarimiz</h3>
            <i className='purpose-card-descr'>
              ZamonAI har doim bepul bo'ladi va u barcha o'rta va yuqori sinf
              o'quvchilari uchun ochiq. Biz ishonamizki, erta boshlash va yosh
              avlodni kuchli informatika "asboblar qutisi" ni yaratish uchun
              zarur bo'lgan resurslar va tajribalar bilan ta'minlash orqali biz
              ilm-fan uchun kuchli kelajakni o'rnatishga yordam bera olamiz.{' '}
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purpose;
