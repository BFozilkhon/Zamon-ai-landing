import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

import './style.css';

const Top = () => {
  const [y, setY] = useState();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setY(window.scrollY);
    });
  }, []);

  return (
    <>
      {y >= 400 ? (
        <div
          onClick={() => window.scrollTo(0, 0)}
          data-aos='fade-down'
          className='container'
        >
          <FaArrowUp className='icon' />
        </div>
      ) : null}
    </>
  );
};

export default Top;
