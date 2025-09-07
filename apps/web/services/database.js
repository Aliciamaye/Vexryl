// Database service for Vexryl Platform
// Replaces localStorage with Supabase integration

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API base URL
const API_BASE = import.meta.env.VITE_API_URL || 'https://vexryl-api.your-subdomain.workers.dev';

// Helper function for authenticated requests
async function authenticatedFetch(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}

// Commands API
export const commandsAPI = {
  // Get all user commands
  async getAll() {
    return authenticatedFetch('/api/commands');
  },

  // Create new command
  async create(commandData) {
    return authenticatedFetch('/api/commands', {
      method: 'POST',
      body: JSON.stringify({
        name: commandData.name,
        description: commandData.description,
        data: commandData, // Store full command config in data field
        enabled: commandData.enabled || true,
        collaborators: commandData.collaborators || 0,
        executions: commandData.executions || 0
      }),
    });
  },

  // Update command
  async update(commandId, commandData) {
    return authenticatedFetch(`/api/commands/${commandId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: commandData.name,
        description: commandData.description,
        data: commandData,
        enabled: commandData.enabled,
        collaborators: commandData.collaborators,
        executions: commandData.executions
      }),
    });
  },

  // Delete command
  async delete(commandId) {
    return authenticatedFetch(`/api/commands/${commandId}`, {
      method: 'DELETE',
    });
  },
};

// Events API
export const eventsAPI = {
  // Get all user events
  async getAll() {
    return authenticatedFetch('/api/events');
  },

  // Create new event
  async create(eventData) {
    return authenticatedFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        name: eventData.name,
        description: eventData.description,
        data: eventData, // Store full workflow config in data field
        enabled: eventData.enabled || true,
        collaborators: eventData.collaborators || 0,
        executions: eventData.executions || 0
      }),
    });
  },

  // Update event
  async update(eventId, eventData) {
    return authenticatedFetch(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: eventData.name,
        description: eventData.description,
        data: eventData,
        enabled: eventData.enabled,
        collaborators: eventData.collaborators,
        executions: eventData.executions
      }),
    });
  },

  // Delete event
  async delete(eventId) {
    return authenticatedFetch(`/api/events/${eventId}`, {
      method: 'DELETE',
    });
  },
};

// Projects API
export const projectsAPI = {
  // Get all user projects
  async getAll() {
    return authenticatedFetch('/api/projects');
  },

  // Create new project
  async create(projectData) {
    return authenticatedFetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  // Export project to GitHub and delete from platform
  async exportToGitHub(projectId) {
    return authenticatedFetch('/api/github/export', {
      method: 'POST',
      body: JSON.stringify({ projectId }),
    });
  },
};

// Marketplace API
export const marketplaceAPI = {
  // Get public marketplace items
  async getPublicItems() {
    const response = await fetch(`${API_BASE}/api/marketplace`);
    return response.json();
  },
};

// Snapshots API (for version control)
export const snapshotsAPI = {
  // Create snapshot
  async create(projectId, data, message = 'Manual save') {
    return authenticatedFetch('/api/snapshots', {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId,
        type: 'manual',
        data,
        message,
      }),
    });
  },
};

// Auth helpers
export const auth = {
  // Sign up
  async signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          username: username,
          email: email,
        });

      if (profileError) throw profileError;
    }

    return data;
  },

  // Sign in
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to commands changes
  subscribeToCommands(userId, callback) {
    return supabase
      .channel('commands')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'commands',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  },

  // Subscribe to events changes
  subscribeToEvents(userId, callback) {
    return supabase
      .channel('events')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'events',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe(subscription) {
    return supabase.removeChannel(subscription);
  },
};

// Migration helper - remove after migration is complete
export const migration = {
  // Migrate localStorage data to Supabase
  async migrateFromLocalStorage() {
    try {
      // Get data from localStorage
      const localCommands = JSON.parse(localStorage.getItem('vexryl_commands') || '[]');
      const localEvents = JSON.parse(localStorage.getItem('vexryl_events') || '[]');

      // Migrate commands
      for (const command of localCommands) {
        await commandsAPI.create(command);
      }

      // Migrate events
      for (const event of localEvents) {
        await eventsAPI.create(event);
      }

      // Clear localStorage after successful migration
      localStorage.removeItem('vexryl_commands');
      localStorage.removeItem('vexryl_events');

      console.log('Migration completed successfully');
      return { success: true, migrated: { commands: localCommands.length, events: localEvents.length } };
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },
};
