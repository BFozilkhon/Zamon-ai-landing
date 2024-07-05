import React from 'react';
import Opener from '../../components/Opener';
import Posts from '../../components/Posts';
import Team from '../../components/Team';
import FAQ from '../../components/FAQ';
import Contact from '../../components/Contact';

const Home = () => {
  return (
    <>
      <Opener />
      <Posts />
      <Contact />
      <Team />
      <FAQ />
    </>
  );
};

export default Home;
