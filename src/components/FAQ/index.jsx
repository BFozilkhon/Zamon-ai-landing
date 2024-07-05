import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import faqData from '../../assets/fake_data/faq_data';

import './style.css';

const FAQ = () => {
  const [openIndices, setOpenIndices] = useState([]);

  const handleToggle = (index) => {
    setOpenIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };

  return (
    <div id='faq' className='faq-container'>
      <h1 data-aos='fade-up' className='faq-header'>
        Frequently Asked <br /> Questions
      </h1>
      <div data-aos='zoom-in-down' className='faq-box'>
        <div className='faq-circles'>
          <div className='faq-circle circle-red' />
          <div className='faq-circle circle-orange' />
          <div className='faq-circle circle-green' />
        </div>

        <p className='faq-prompt'>6 FAQ Questions Answered</p>

        <div className='faq-questions-wrapper'>
          {faqData.map((item) => (
            <div
              key={item.id}
              className={`faq-question-box ${
                openIndices.includes(item.id) ? 'open' : ''
              }`}
            >
              <div
                className='faq-question-part'
                onClick={() => handleToggle(item.id)}
              >
                <div className='faq-qs-title'>
                  {item.id}. {item.question}
                </div>
                <div className='faq-icon'>
                  {openIndices.includes(item.id) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
              </div>
              <div className='faq-answer-part'>
                <p>{item.answer}</p>
                <hr className='faq-qs-line' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
