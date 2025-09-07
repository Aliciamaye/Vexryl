import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setUser(session?.user || null);
        
        // Create or update user profile in database
        if (session?.user) {
          await createOrUpdateUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
        
        if (session?.user) {
          await createOrUpdateUserProfile(session.user);
        }
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const createOrUpdateUserProfile = async (user) => {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (error && error.code !== '23505') { // Ignore unique constraint errors
        console.error('Error updating user profile:', error);
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;
      
      // Also update the users table
      await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updateProfile,
  };
};
