import { supabase } from './supabase';

/**
 * Authentication service for handling all Supabase auth operations
 */
const authService = {
  /**
   * Get the current authenticated user
   * 
   * @returns {Promise<Object|null>} Current user or null if not authenticated
   */
  async getCurrentUser() {
    try {
      console.log('Getting current user...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }
      
      console.log('Auth user found:', user.email);
      
      // Get additional user data from profiles table
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') { // No results found
          console.log('Profile not found, creating one with admin role...');
          try {
            // Create a new profile for the user
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: user.id,
                  email: user.email,
                  name: user.user_metadata?.name || 'User',
                  avatar_url: user.user_metadata?.avatar_url || '',
                  role: 'admin', // For now, make all users admin in development
                }
              ]);
              
            if (insertError) {
              console.error('Error creating user profile:', insertError);
            } else {
              console.log('Profile created with admin role');
              
              // Fetch the newly created profile
              const { data: newProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
                
              if (fetchError) {
                console.error('Error fetching new profile:', fetchError);
              } else {
                console.log('New profile fetched:', newProfile);
                data = newProfile;
              }
            }
          } catch (createError) {
            console.error('Error in profile creation:', createError);
          }
        }
      } else {
        console.log('Existing profile found:', data);
        
        // Always ensure the user has admin role in development
        if (data.role !== 'admin') {
          console.log('Updating role to admin for existing user');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error updating role:', updateError);
          } else {
            data.role = 'admin';
          }
        }
      }
      
      const fullUser = {
        ...user,
        ...data
      };
      
      console.log('Returning full user with role:', fullUser.role);
      return fullUser;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  },
  
  /**
   * Sign in with email and password
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Auth response with user data
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Sign up a new user
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} userData - Additional user data (name, etc.)
   * @returns {Promise<Object>} Auth response with user data
   */
  async signUp(email, password, userData = {}) {
    console.log('Signing up user:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name || '',
        }
      }
    });
    
    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }
    
    // Create profile record if signup was successful
    if (data.user) {
      console.log('Creating profile for new user:', data.user.id);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: userData.name || '',
            avatar_url: userData.avatar || '',
            role: 'admin', // Assign admin role to all new users during development
          }
        ]);
        
      if (profileError) {
        console.error('Error creating user profile:', profileError);
      } else {
        console.log('Profile created with admin role');
      }
    }
    
    return data;
  },
  
  /**
   * Sign out the current user
   * 
   * @returns {Promise<void>}
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  
  /**
   * Reset password for a user
   * 
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
  
  /**
   * Update user profile
   * 
   * @param {Object} profile - Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(profile) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Update user email
   * 
   * @param {string} email - New email
   * @returns {Promise<Object>} Auth response
   */
  async updateEmail(email) {
    const { data, error } = await supabase.auth.updateUser({ email });
    
    if (error) {
      console.error('Error updating email:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Update user password
   * 
   * @param {string} password - New password
   * @returns {Promise<Object>} Auth response
   */
  async updatePassword(password) {
    const { data, error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      console.error('Error updating password:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Check if a user has a specific role
   * 
   * @param {string} role - Role to check
   * @returns {Promise<boolean>} True if user has the role
   */
  async hasRole(role) {
    try {
      const user = await this.getCurrentUser();
      console.log('Checking role:', role, 'for user:', user);
      return user && user.role === role;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  },
  
  /**
   * Check if the current user is an admin
   * 
   * @returns {Promise<boolean>} True if user is an admin
   */
  async isAdmin() {
    try {
      console.log('Checking if user is admin...');
      const result = await this.hasRole('admin');
      console.log('Admin check result:', result);
      return result;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
  
  /**
   * Check if the current user is an editor
   * 
   * @returns {Promise<boolean>} True if user is an editor
   */
  async isEditor() {
    return this.hasRole('editor');
  },
  
  /**
   * Upload user avatar
   * 
   * @param {File} file - Avatar image file
   * @returns {Promise<string>} URL of the uploaded avatar
   */
  async uploadAvatar(file) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true
      });
      
    if (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    // Update profile with new avatar URL
    await this.updateProfile({
      avatar_url: data.publicUrl
    });
    
    return data.publicUrl;
  },
  
  /**
   * Create a test admin user if needed
   * For development purposes only
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} - Created user
   */
  async createTestAdmin(email, password) {
    console.log('Creating test admin user...');
    try {
      // First sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: 'Admin User',
          }
        }
      });
      
      if (error) {
        console.error('Error creating test admin:', error);
        throw error;
      }
      
      if (!data.user) {
        throw new Error('Failed to create user');
      }
      
      console.log('Created user, now setting admin role...');
      
      // Insert the profile with admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: 'Admin User',
            role: 'admin'
          }
        ]);
        
      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        throw profileError;
      }
      
      console.log('Admin user created successfully!');
      return data.user;
    } catch (error) {
      console.error('Failed to create test admin:', error);
      throw error;
    }
  },
  
  /**
   * Promote an existing user to admin role
   * @param {string} email - Email of the user to promote
   * @returns {Promise<boolean>} - Success status
   */
  async makeUserAdmin(email) {
    console.log('Promoting user to admin:', email);
    try {
      // First try to get the current user if they match the email
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser && currentUser.email === email) {
        console.log('Found current user with matching email');
        
        // Update or create profile with admin role
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: currentUser.id,
              email: currentUser.email,
              name: currentUser.user_metadata?.name || 'Admin User',
              role: 'admin',
              updated_at: new Date().toISOString()
            }
          ]);
          
        if (upsertError) {
          console.error('Error updating profile for current user:', upsertError);
          return false;
        }
        
        console.log('Successfully promoted current user to admin');
        return true;
      }
    
      // Otherwise try to find the user by email in profiles table
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
        
      if (userError) {
        console.error('Error finding user:', userError);
        
        // Try to find user directly in auth table
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
          filters: { email: email }
        });
        
        if (authError || !authData || !authData.users || authData.users.length === 0) {
          console.error('Error finding user in auth:', authError || 'User not found');
          return false;
        }
        
        const userId = authData.users[0].id;
        
        // Create profile with admin role if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              email: email,
              name: 'Admin User',
              role: 'admin'
            }
          ]);
          
        if (insertError) {
          console.error('Error creating admin profile:', insertError);
          return false;
        }
        
        console.log('Created admin profile for user:', email);
        return true;
      }
      
      // Update the user's role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userData.id);
        
      if (updateError) {
        console.error('Error updating user role:', updateError);
        return false;
      }
      
      console.log('Successfully promoted user to admin:', email);
      return true;
    } catch (error) {
      console.error('Error in makeUserAdmin:', error);
      return false;
    }
  },
};

export default authService; 