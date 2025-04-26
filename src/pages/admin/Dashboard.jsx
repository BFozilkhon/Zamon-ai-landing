import React, { useState } from 'react';
import { Route, Routes, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { BiHomeAlt, BiNews, BiUserCircle, BiCog, BiLogOut, BiMenu, BiCommentDetail } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';
import ArticleManager from './ArticleManager';
import ArticleEditor from './ArticleEditor';
import UserManager from './UserManager';
import Settings from './Settings';
import './admin.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="admin-dashboard">
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <h2>ZAMON AI</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <BiMenu />
          </button>
        </div>
        
        <div className="admin-user-info">
          <div className="admin-avatar">
            <img src={currentUser?.avatar || 'https://via.placeholder.com/150'} alt={currentUser?.name || 'User'} />
          </div>
          <div className="admin-user-details">
            <h3>{currentUser?.name || 'Admin User'}</h3>
            <p>{currentUser?.role || 'Administrator'}</p>
          </div>
        </div>
        
        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/admin" className={isActive('/admin') && !isActive('/admin/articles') && !isActive('/admin/users') && !isActive('/admin/settings') ? 'active' : ''}>
                <BiHomeAlt /> <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/articles" className={isActive('/admin/articles') ? 'active' : ''}>
                <BiNews /> <span>Articles</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>
                <BiUserCircle /> <span>Users</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" className={isActive('/admin/settings') ? 'active' : ''}>
                <BiCog /> <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="admin-sidebar-footer">
          <button className="sign-out-button" onClick={handleSignOut}>
            <BiLogOut /> <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="admin-header">
          <button className="mobile-menu-toggle" onClick={toggleSidebar}>
            <BiMenu />
          </button>
          <h1>Admin Panel</h1>
        </div>
        
        <div className="admin-main">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/articles" element={<ArticleManager />} />
            <Route path="/articles/new" element={<ArticleEditor />} />
            <Route path="/articles/edit/:id" element={<ArticleEditor />} />
            <Route path="/users" element={<UserManager />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AdminHome = () => {
  return (
    <div className="admin-home">
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Articles</h3>
          <p className="stat-number">24</p>
          <p className="stat-description">Total articles</p>
        </div>
        
        <div className="admin-stat-card">
          <h3>Users</h3>
          <p className="stat-number">128</p>
          <p className="stat-description">Registered users</p>
        </div>
        
        <div className="admin-stat-card">
          <h3>Comments</h3>
          <p className="stat-number">342</p>
          <p className="stat-description">Total comments</p>
        </div>
        
        <div className="admin-stat-card">
          <h3>Views</h3>
          <p className="stat-number">12.4K</p>
          <p className="stat-description">Total page views</p>
        </div>
      </div>
      
      <div className="admin-recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon article">
              <BiNews />
            </div>
            <div className="activity-details">
              <p className="activity-title">New article published</p>
              <p className="activity-description">The Future of AI in Healthcare</p>
              <p className="activity-time">2 hours ago</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon comment">
              <BiCommentDetail />
            </div>
            <div className="activity-details">
              <p className="activity-title">New comment</p>
              <p className="activity-description">User "john_doe" commented on "Machine Learning Basics"</p>
              <p className="activity-time">5 hours ago</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon user">
              <BiUserCircle />
            </div>
            <div className="activity-details">
              <p className="activity-title">New user registered</p>
              <p className="activity-description">sarah.smith@example.com</p>
              <p className="activity-time">Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 