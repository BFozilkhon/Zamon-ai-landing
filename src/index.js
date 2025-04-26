import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainRoot from './root/main';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <MainRoot />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
