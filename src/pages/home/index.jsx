import React from 'react';
import Opener from '../../components/Opener';
import Posts from '../../components/Posts';
import Team from '../../components/Team';
import FAQ from '../../components/FAQ';
import Contact from '../../components/Contact';
import Hackathon from '../../components/Hackathon';
import Purpose from '../../components/Purpose';
import Partner from '../../components/Partner';

import './style.css';

const Home = () => {
  return (
    <div className='home-container'>
      <Opener />
      <Purpose />
      <Hackathon />
      <Partner />
      <Posts />
      <Contact />
      <Team />
      <FAQ />
    </div>
  );
};

export default Home;
