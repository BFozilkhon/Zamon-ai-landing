import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import img from '../../assets/images/hackathon3.jpg';
import './style.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '+998',
    telegram: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const formattedPhone = value.replace(/[^\d]/g, '');

      setFormData({ ...formData, [name]: '+998' + formattedPhone.slice(3) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phone || !/^\+998\d{9}$/.test(formData.phone))
      newErrors.phone = 'Valid phone number is required';
    if (!formData.telegram)
      newErrors.telegram = 'Telegram username is required';
    if (!formData.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
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
            window.location.reload();
          },
          (error) => {
            alert('An error occurred, please try again.');
          }
        );
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div id='contact' className='contact-container'>
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
            {errors.name && <span className='error'>{errors.name}</span>}
            <input
              className='contact-input'
              placeholder='Phone Number'
              type='text'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className='error'>{errors.phone}</span>}
            <input
              className='contact-input'
              placeholder='Telegram Username'
              type='text'
              name='telegram'
              value={formData.telegram}
              onChange={handleChange}
            />
            {errors.telegram && (
              <span className='error'>{errors.telegram}</span>
            )}
            <textarea
              className='contact-textarea'
              placeholder='Ask your question?'
              rows={7}
              name='message'
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            {errors.message && <span className='error'>{errors.message}</span>}
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
