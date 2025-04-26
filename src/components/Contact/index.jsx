import React, { useState } from 'react';
import axios from 'axios';
import img from '../../assets/images/contact.png';
import './style.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '+998',
    telegram: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitStatus(null);
      
      try {
        // Replace this URL with your deployed Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec';
        
        const response = await axios.post(scriptURL, null, {
          params: {
            name: formData.name,
            phone: formData.phone,
            telegram: formData.telegram,
            message: formData.message,
            timestamp: new Date().toISOString()
          }
        });
        
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '+998',
          telegram: '',
          message: '',
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div id='contact' className='contact-container'>
      <h1 data-aos='fade-up' className='contact-header'>
         <span>ZamonAI Contact</span>
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
          {submitStatus === 'success' && (
            <div className="success-message">
              Your message has been sent successfully! We'll contact you soon.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="error-message">
              There was an error sending your message. Please try again later.
            </div>
          )}
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
            <button 
              className='contact-btn' 
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
