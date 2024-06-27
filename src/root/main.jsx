import React, { useEffect } from 'react';
import Aos from 'aos';

import Navbar from '../components/Navbar';
import Opener from '../components/Opener';
import Posts from '../components/Posts';
import FAQ from '../components/FAQ';
import Team from '../components/Team';
import Footer from '../components/Footer';

const MainRoot = () => {
  useEffect(() => {
    Aos.init({
      duration: 2000,
      mirror: true,
      once: false,
    });
  }, []);
  return (
    <div>
      <Navbar />
      <Opener />
      <Posts />
      <Team />
      <FAQ />
      <Footer />
    </div>
  );
};

export default MainRoot;
