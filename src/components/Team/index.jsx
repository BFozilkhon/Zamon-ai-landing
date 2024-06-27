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

const Team = () => {
  return (
    <div className='team-container'>
      <h1 className='team-header'>
        Our <span>The BEST</span> Team
      </h1>
      <p className='team-descr'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt soluta ut,
        voluptatum repudiandae mollitia iste beatae facere quo, quod distinctio
        perspiciatis minima corrupti esse tempora? Quam soluta iure porro et
        dolores enim aliquam odio, ducimus repellendus animi cum facere omnis?
      </p>

      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[Navigation, Autoplay]}
        className='mySwiper'
      >
        <SwiperSlide>
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
        <SwiperSlide>
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
        <SwiperSlide>
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
        <SwiperSlide>
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
        <SwiperSlide>
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
