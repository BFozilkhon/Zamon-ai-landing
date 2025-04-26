import React from 'react';
import Opener from '../../components/Opener';
import Posts from '../../components/Posts';
// import Team from '../../components/Team';
import FAQ from '../../components/FAQ';
import Contact from '../../components/Contact';
import Purpose from '../../components/Purpose';

import './style.css';

const Home = () => {
  return (
    <div className='home-container'>
      <Opener />
      <Purpose />
      <Posts />
      <Contact />
      {/* <Team /> */}
      <FAQ />
    </div>
  );
};

export default Home;
