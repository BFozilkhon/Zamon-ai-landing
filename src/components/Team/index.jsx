import React from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Navigation, Autoplay } from 'swiper/modules';

import './style.css';
import teamData from '../../assets/fake_data/team_data';

const teamSlider = {
  navigation: true,
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    600: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 25,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
};

const Team = () => {
  return (
    <div id='team' className='team-container'>
      <h1 data-aos='fade-up' className='team-header'>
        Bizning <span>Jamoa</span>
      </h1>
      <p data-aos='fade-up' className='team-descr'>
        Biz innovatsiyalardan foydalanib, muvaffaqiyatga erishishga intilamiz.
        Hamkorlik va yuqori natijalar - bizning asosiy printsipimiz.
      </p>

      <Swiper
        data-aos='fade-up'
        slidesPerView={4}
        {...teamSlider}
        loop={true}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[Navigation, Autoplay]}
        className='team-swiper'
      >
        {teamData?.map((value) => {
          return (
            <SwiperSlide key={value.id} className='team-swiper-slide'>
              {/* first card */}
              <div className='team-card'>
                <img className='team-img' src={value?.img} alt='team-img1' />
                <h3 className='team-name'>
                  {value?.name} {value?.surname}
                </h3>
                <p className='team-position'>{value?.role}</p>
                <p className='team-telegram'>{value?.telegram}</p>
              </div>
              {/* end of first card */}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Team;
