import React, { useEffect, useLayoutEffect } from 'react';
import Aos from 'aos';
import { Routes, Route } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/home';
import PostsPage from '../pages/posts';
import Top from '../components/TopBar';
import PostParams from '../pages/postParams';

const MainRoot = () => {
  useEffect(() => {
    Aos.init({
      duration: 2000,
      mirror: true,
      once: true,
    });
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/posts' element={<PostsPage />} />
        <Route path='/post/:id' element={<PostParams />} />
      </Routes>
      <Top />
      <Footer />
    </>
  );
};

export default MainRoot;
