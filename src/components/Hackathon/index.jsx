import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

import targetImg from '../../assets/images/target.png';

import './style.css';

const Hackathon = () => {
  return (
    <div data-aos='fade-up' className='hack-container'>
      <div className='hack-wrapper'>
        <p className='hack-prompt'>
          "ZamonAI Team" partner with "Target Internationa School"
        </p>
        <h1 className='hack-header'>Artificial Intelligence Hackathon</h1>
        <p className='hack-descr'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nobis
          repellat placeat facilis ex alias provident! Quam cupiditate impedit
          voluptatum tenetur esse deleniti a suscipit. Expedita corrupti
          consectetur ipsum perferendis!
        </p>

        <button className='hack-btn'>
          Register
          <MdArrowOutward className='hack-icon' />
        </button>

        <img src={targetImg} alt='target' className='hack-img' />
      </div>
    </div>
  );
};

export default Hackathon;
