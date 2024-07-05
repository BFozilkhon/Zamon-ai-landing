import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import img from '../../assets/images/hackathon3.jpg';
import './style.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    telegram: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        'service_wlkxbt9',
        'template_l2dgs5g',
        formData,
        'user_pywPsnKY1q8czlk9MyD56'
      )
      .then(
        (result) => {
          alert('Message sent successfully!');
        },
        (error) => {
          alert('An error occurred, please try again.');
        }
      );
  };

  return (
    <div className='contact-container'>
      <h1 data-aos='fade-up' className='contact-header'>
        ZamonAI <span> Contact</span>
      </h1>
      <div className='contact-wrapper'>
        <img
          data-aos='fade-up-right'
          className='contact-box1'
          src={img}
          alt='img'
        />
        <div data-aos='fade-up-left' className='contact-box2'>
          <h3 className='contact-title'>Send your question</h3>
          <form onSubmit={handleSubmit}>
            <input
              className='contact-input'
              placeholder='F.I.O'
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
            />
            <input
              className='contact-input'
              placeholder='Phone Number'
              type='text'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              className='contact-input'
              placeholder='Telegram Username'
              type='text'
              name='telegram'
              value={formData.telegram}
              onChange={handleChange}
            />
            <textarea
              className='contact-textarea'
              placeholder='Ask your question?'
              rows={7}
              name='message'
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <button className='contact-btn' type='submit'>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
