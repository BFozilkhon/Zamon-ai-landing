import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { supabase, isDevMode } from '../services/supabase';

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available to any
// child component that calls useAuth().
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('AuthProvider initialized, loading:', loading);

  // Additional function to safely update loading state
  const safeSetLoading = (value) => {
    console.log(`Setting loading state to: ${value}`);
    setLoading(value);
  };

  // Initialize auth state from Supabase session on app load
  useEffect(() => {
    console.log('AuthProvider useEffect running');
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // In development mode with placeholder credentials, create a fake user
        if (isDevMode) {
          console.log('Development mode active - using fake admin user');
          setCurrentUser({
            id: 'dev-user-id',
            email: 'dev@example.com',
            role: 'admin',
            name: 'Development Admin'
          });
          console.log('Setting fake user complete, will set loading to false');
          safeSetLoading(false);
          console.log('Loading state should now be false');
          return;
        }
        
        const user = await authService.getCurrentUser();
        console.log('Current user:', user);
        setCurrentUser(user);
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err.message);
      } finally {
        console.log('Auth initialization completed (finally block)');
        safeSetLoading(false);
        console.log('Loading state should now be false from finally block');
      }
    };

    console.log('About to call initializeAuth()');
    initializeAuth();
    console.log('Called initializeAuth()');
    
    // Only set up auth state change listener if not in dev mode
    if (!isDevMode) {
      console.log('Setting up auth state listener...');
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session);
          if (event === 'SIGNED_IN') {
            const user = await authService.getCurrentUser();
            console.log('User signed in:', user);
            setCurrentUser(user);
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            setCurrentUser(null);
          } else if (event === 'USER_UPDATED') {
            const user = await authService.getCurrentUser();
            console.log('User updated:', user);
            setCurrentUser(user);
          }
        }
      );
      
      // Cleanup subscription
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  // Handle sign in
  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    
    // In development mode, always return success with fake user
    if (isDevMode) {
      const devUser = {
        id: 'dev-user-id',
        email: email || 'dev@example.com',
        role: 'admin',
        name: 'Development Admin'
      };
      setCurrentUser(devUser);
      setLoading(false);
      return { success: true, user: devUser };
    }
    
    try {
      const { user } = await authService.signIn(email, password);
      setCurrentUser(user);
      setLoading(false);
      return { success: true, user };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Handle sign up
  const signUp = async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    // In development mode, always return success with fake user
    if (isDevMode) {
      const devUser = {
        id: 'dev-user-id',
        email: email || 'dev@example.com',
        role: 'admin',
        name: name || 'Development Admin'
      };
      setCurrentUser(devUser);
      setLoading(false);
      return { success: true, user: devUser };
    }
    
    try {
      const { user } = await authService.signUp(email, password, { name });
      setCurrentUser(user);
      setLoading(false);
      return { success: true, user };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Handle sign out
  const signOut = async () => {
    // In development mode, just clear the current user
    if (isDevMode) {
      setCurrentUser(null);
      return;
    }
    
    try {
      await authService.signOut();
      setCurrentUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Force refresh current user data
  const refreshProfile = async () => {
    // No need to refresh in dev mode
    if (isDevMode) return currentUser;
    
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      console.log('Profile refreshed:', user);
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('Error refreshing profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    // In development mode, always return true for admin role
    if (isDevMode && role === 'admin') return true;
    
    console.log('Context hasRole check:', { role, currentUserRole: currentUser?.role });
    return Boolean(currentUser?.role === role);
  };

  // Value object that will be passed to consumers
  const value = {
    currentUser,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    hasRole,
    isAdmin: () => {
      // Always return true for admin checks in development mode
      if (isDevMode) return true;
      return hasRole('admin');
    },
    isEditor: () => hasRole('editor'),
    isAuthenticated: isDevMode || !!currentUser, // Always authenticated in dev mode
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 