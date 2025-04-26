import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/home';
import PostsPage from '../pages/posts';
import Top from '../components/TopBar';
import PostParams from '../pages/postParams';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/admin/Dashboard';

// Protected Route component for admin-only access
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  
  // Add timeout to detect stuck loading state
  useEffect(() => {
    console.log(`AdminRoute mount - loading: ${loading}, isAuthenticated: ${isAuthenticated}`);
    
    // Set a timeout to bypass stuck loading states after 5 seconds
    const timeoutId = setTimeout(() => {
      console.log("Loading timeout triggered - forcing render");
      setTimeoutOccurred(true);
      setLocalLoading(false);
    }, 5000);
    
    // Normal loading state handling
    if (!loading) {
      console.log("Loading complete naturally");
      setLocalLoading(false);
      clearTimeout(timeoutId);
    }
    
    return () => {
      clearTimeout(timeoutId);
      console.log("AdminRoute unmounted");
    };
  }, [loading, isAuthenticated]);
  
  // Log every render
  console.log(`AdminRoute render - loading: ${loading}, localLoading: ${localLoading}, isAuthenticated: ${isAuthenticated}, timeoutOccurred: ${timeoutOccurred}`);
  
  // Check loading state
  if (loading && !timeoutOccurred) {
    console.log('AdminRoute: Loading state active');
    return <div className="admin-loading">Loading...</div>;
  }
  
  // Force render admin dashboard if timeout occurred
  if (timeoutOccurred) {
    console.log('AdminRoute: Loading timeout occurred, forcing render');
    return children;
  }
  
  if (!isAuthenticated) {
    console.log('AdminRoute: Not authenticated - redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    console.log('AdminRoute: Not admin - redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  console.log('AdminRoute: Rendering admin content');
  return children;
};

// Protected Route component for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const MainRoot = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/posts' element={<PostsPage />} />
        <Route path='/post/:id' element={<PostParams />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path='/profile' element={
          <ProtectedRoute>
            <div>Profile Page (to be implemented)</div>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path='/admin/*' element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        
        {/* 404 Route */}
        <Route path='*' element={<div>404 Page Not Found</div>} />
      </Routes>
      <Top />
      <Footer />
    </>
  );
};

export default MainRoot;
