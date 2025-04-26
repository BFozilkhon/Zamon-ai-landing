import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import './auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [isPromotingUser, setIsPromotingUser] = useState(false);
  
  const { signIn, error, currentUser, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!email.trim() || !password.trim()) {
      setFormError('Please fill in all fields');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // Add debugging info
        console.log('Login successful', { 
          user: result.user,
          isAuthenticated: !!result.user
        });
        navigate(from);
      } else {
        setFormError(result.error || 'Login failed');
      }
    } catch (err) {
      setFormError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // For demo purposes - fills in admin credentials
  const fillDemoCredentials = () => {
    setEmail('admin@example.com');
    setPassword('password123');
  };
  
  // Create a test admin user
  const createTestAdmin = async () => {
    try {
      setIsCreatingAdmin(true);
      setFormError('');
      
      await authService.createTestAdmin('admin@example.com', 'password123');
      
      // Fill in the credentials
      fillDemoCredentials();
      
      setIsCreatingAdmin(false);
      alert('Test admin created successfully! You can now log in with these credentials.');
    } catch (error) {
      setIsCreatingAdmin(false);
      console.error('Error creating test admin:', error);
      
      if (error.message?.includes('already exists')) {
        setFormError('Admin user already exists. Use the demo credentials.');
        fillDemoCredentials();
      } else {
        setFormError('Error creating admin: ' + (error.message || 'Unknown error'));
      }
    }
  };
  
  // Promote current user to admin
  const promoteToAdmin = async () => {
    if (!email) {
      setFormError('Please enter your email first');
      return;
    }
    
    try {
      setIsPromotingUser(true);
      setFormError('');
      
      const success = await authService.makeUserAdmin(email);
      
      if (success) {
        // If current user is being promoted and already logged in, refresh their profile
        if (currentUser && currentUser.email === email) {
          await refreshProfile();
          alert(`Your account has been promoted to admin! You can now access the admin area.`);
          navigate('/admin');
        } else {
          alert(`User ${email} has been promoted to admin! Please log in again.`);
        }
      } else {
        setFormError('Failed to promote user. Please try creating a test admin instead.');
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      setFormError('Error promoting user: ' + (error.message || 'Unknown error'));
    } finally {
      setIsPromotingUser(false);
    }
  };
  
  // Direct admin access for development testing
  const bypassLogin = () => {
    console.log('Bypassing login for development testing');
    navigate('/admin');
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your account</p>
        </div>
        
        {(formError || error) && (
          <div className="auth-error">
            {formError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isSubmitting || isCreatingAdmin || isPromotingUser}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              disabled={isSubmitting || isCreatingAdmin || isPromotingUser}
              required
            />
          </div>
          
          <div className="form-group remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting || isCreatingAdmin || isPromotingUser}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="admin-actions">
            <button 
              type="button"
              onClick={fillDemoCredentials}
              className="demo-button"
              disabled={isSubmitting || isCreatingAdmin || isPromotingUser}
            >
              Use Demo Credentials
            </button>
            
            <button 
              type="button"
              onClick={createTestAdmin}
              className="test-admin-button"
              disabled={isSubmitting || isCreatingAdmin || isPromotingUser}
            >
              {isCreatingAdmin ? 'Creating Admin...' : 'Create Test Admin User'}
            </button>
            
            <button 
              type="button"
              onClick={promoteToAdmin}
              className="promote-admin-button"
              disabled={isSubmitting || isCreatingAdmin || isPromotingUser || !email}
            >
              {isPromotingUser ? 'Promoting User...' : 'Promote This User to Admin'}
            </button>
            
            <button 
              type="button"
              onClick={bypassLogin}
              className="bypass-button"
              style={{ background: '#ff9800', color: 'white' }}
            >
              Bypass Login (Dev Only)
            </button>
          </div>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 