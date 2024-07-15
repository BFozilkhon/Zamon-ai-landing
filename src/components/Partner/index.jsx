import React from 'react';

import partner1 from '../../assets/images/partner3.jpg';
import partner2 from '../../assets/images/partner2.jpg';
import partner3 from '../../assets/images/partner1.jpg';

import './style.css';

const Partner = () => {
  return (
    <div class='partner-container'>
      <div class='partner-wrapper'>
        <h2 data-aos='fade-up' class='partner-header'>
          Bizning <span> Hamkorlar</span>
        </h2>
        <div class='partner-box'>
          <div data-aos='fade-up' class='partner-card'>
            <img src={partner1} alt='Partner 1 Logo' class='partner-logo' />
            <h3 class='partner-name'>Target School</h3>
            <a
              href='https://t.me/targetschooluz'
              target='_blank'
              class='partner-link'
            >
              Visit Partner
            </a>
          </div>
          <div data-aos='fade-up' class='partner-card'>
            <img src={partner2} alt='Partner 2 Logo' class='partner-logo' />
            <h3 class='partner-name'>IT Stars</h3>
            <a
              href='https://t.me/itstarsasia'
              target='_blank'
              class='partner-link'
            >
              Visit Partner
            </a>
          </div>
          <div data-aos='fade-up' class='partner-card'>
            <img src={partner3} alt='Partner 3 Logo' class='partner-logo' />
            <h3 class='partner-name'>Startup Choyxona</h3>
            <a
              href='https://t.me/startup_choyxona'
              target='_blank'
              class='partner-link'
            >
              Visit Partner
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
