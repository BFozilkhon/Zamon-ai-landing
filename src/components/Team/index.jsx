import React from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Navigation, Autoplay } from 'swiper/modules';

import img1 from '../../assets/images/team.png';

import './style.css';

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
    <div className='team-container'>
      <h1 data-aos='fade-up' className='team-header'>
        Our <span>The BEST</span> Team
      </h1>
      <p data-aos='fade-up' className='team-descr'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt soluta ut,
        voluptatum repudiandae mollitia iste beatae facere quo, quod distinctio
        perspiciatis minima corrupti esse tempora? Quam soluta iure porro et
        dolores enim aliquam odio, ducimus repellendus animi cum facere omnis?
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
        <SwiperSlide className='team-swiper-slide'>
          {/* first card */}
          <div className='team-card'>
            <img className='team-img' src={img1} alt='team-img1' />
            <h3 className='team-name'>Fozilkhon Buzrukxojayev</h3>
            <p className='team-position'>Frontend developer</p>
            <div className='team-social-flex'>
              <a className='team-social-icons' href='#'></a>
              <a className='team-social-icons' href='#'></a>
              <a className='team-social-icons' href='#'></a>
            </div>
          </div>
          {/* end of first card */}
        </SwiperSlide>
        <SwiperSlide className='team-swiper-slide'>
          {/* first card */}
          <div className='team-card'>
            <img className='team-img' src={img1} alt='team-img1' />
            <h3 className='team-name'>Fozilkhon Buzrukxojayev</h3>
            <p className='team-position'>Frontend developer</p>
            <div className='team-social-flex'>
              <a className='team-social-icons' href='#'></a>
              <a className='team-social-icons' href='#'></a>
              <a className='team-social-icons' href='#'></a>
            </div>
          </div>
          {/* end of first card */}
        </SwiperSlide>
        <SwiperSlide className='team-swiper-slide'>
          {/* first card */}
          <div className='team-card'>
            <img className='team-img' src={img1} alt='team-img1' />
            <h3 className='team-name'>Fozilkhon Buzrukxojayev</h3>
            <p className='team-position'>Frontend developer</p>
            <div className='team-social-flex'>
              <a className='team-social-icons' href='#'></a>
              <a className='team-social-icons' href='#'></a>
              <a className='team-social-icons' href='#'></a>
            </div>
          </div>
          {/* end of first card */}
        </SwiperSlide>
        <SwiperSlide className='team-swiper-slide'>
          {/* first card */}
          <div className='team-card'>
            <img className='team-img' src={img1} alt='team-img1' />
            <h3 className='team-name'>Fozilkhon Buzrukxojayev</h3>
            <p className='team-position'>Frontend developer</p>
            <div className='team-social-flex'>
              <a className='team-social-icons' href='#'></a>
              <a className='team-social-icons' href='#'></a>
              <a className='team-social-icons' href='#'></a>
            </div>
          </div>
          {/* end of first card */}
        </SwiperSlide>
        <SwiperSlide className='team-swiper-slide'>
          {/* first card */}
          <div className='team-card'>
            <img className='team-img' src={img1} alt='team-img1' />
            <h3 className='team-name'>Fozilkhon Buzrukxojayev</h3>
            <p className='team-position'>Frontend developer</p>
            <div className='team-social-flex'>
              <a className='team-social-icons' href='#'></a>
              <a className='team-social-icons' href='#'></a>
              <a className='team-social-icons' href='#'></a>
            </div>
          </div>
          {/* end of first card */}
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Team;
