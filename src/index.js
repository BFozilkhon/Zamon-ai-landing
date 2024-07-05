import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainRoot from './root/main';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MainRoot />
    </BrowserRouter>
  </React.StrictMode>
);
