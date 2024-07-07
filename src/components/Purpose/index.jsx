import React from 'react';
import { FaBrain, FaUsers, FaLaptopCode, FaHandsHelping } from 'react-icons/fa';

import './style.css';

const Purpose = () => {
  return (
    <div className='purpose-container'>
      <div className='purpose-wrapper'>
        <h1 data-aos='fade-up' className='purpose-header'>
          Mission <span>& Vision</span>
        </h1>
        <p data-aos='fade-up' className='purpose-descr'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam,
          quas!
        </p>
        <div data-aos='fade-up' className='purpose-box'>
          <div className='purpose-card'>
            <div className='purpose-circle'>
              <FaBrain className='purpose-icon' />
            </div>
            <h3 className='purpose-card-title'>Our Mission</h3>
            <i className='purpose-card-descr'>
              Universal understanding of AI is essential. To create fair and
              unbiased AI, we must increase diversity and representation in the
              field.
            </i>
          </div>
          <div className='purpose-card'>
            <div className='purpose-circle'>
              <FaUsers className='purpose-icon' />
            </div>
            <h3 className='purpose-card-title'>Our Vision</h3>
            <i className='purpose-card-descr'>
              Empower diverse students in Uzbekistan to explore AI and computer
              science, fostering diversity from middle and high school.
            </i>
          </div>
          <div className='purpose-card'>
            <div className='purpose-circle'>
              <FaLaptopCode className='purpose-icon' />
            </div>
            <h3 className='purpose-card-title'>Our Goal</h3>
            <i className='purpose-card-descr'>
              Address the gap between theoretical and practical knowledge in
              Uzbekistan by conducting hackathons and master classes, fostering
              practical skills and teamwork.
            </i>
          </div>
          <div className='purpose-card'>
            <div className='purpose-circle'>
              <FaHandsHelping className='purpose-icon' />
            </div>
            <h3 className='purpose-card-title'>Our Impact</h3>
            <i className='purpose-card-descr'>
              ZamonAI is free and open to all students, aiming to build a strong
              computer science foundation for a better future.
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purpose;
