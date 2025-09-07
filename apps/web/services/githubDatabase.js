// GitHub Database Service - Main persistent storage system
// Supabase is temporary, GitHub is permanent storage

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_REPO_OWNER = import.meta.env.VITE_GITHUB_REPO_OWNER || 'your-username';
const GITHUB_REPO_NAME = 'vexryl-database';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// GitHub database structure: /users/{userId}/projects/{projectId}/data.json
// Each user gets their own folder to avoid conflicts

export const githubDatabase = {
  // Check current Supabase database size
  async checkDatabaseSize() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/database/size`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });
      const { size_mb } = await response.json();
      return size_mb;
    } catch (error) {
      console.error('Error checking database size:', error);
      return 0;
    }
  },

  // Auto-migrate to GitHub when Supabase hits size limit
  async autoMigrateIfNeeded() {
    const currentSize = await this.checkDatabaseSize();
    
    if (currentSize >= 300) { // 300MB limit
      console.log(`Database size (${currentSize}MB) exceeds limit. Starting auto-migration...`);
      await this.migrateAllUsersToGitHub();
    }
  },

  // Migrate all users to GitHub and clean Supabase
  async migrateAllUsersToGitHub() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/database/migrate-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });
      
      const result = await response.json();
      console.log('Migration completed:', result);
      return result;
    } catch (error) {
      console.error('Auto-migration failed:', error);
      throw error;
    }
  },

  // Load user data from GitHub back to Supabase for active session
  async loadUserDataFromGitHub(userId) {
    try {
      // Get user's folder from GitHub
      const userFolderUrl = `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/users/${userId}`;
      
      const response = await fetch(userFolderUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.status === 404) {
        // User has no data in GitHub yet
        return { commands: [], events: [], projects: [] };
      }

      const folderContents = await response.json();
      const userData = { commands: [], events: [], projects: [] };

      // Load each project's data
      for (const item of folderContents) {
        if (item.type === 'dir' && item.name.startsWith('project-')) {
          const projectData = await this.loadProjectFromGitHub(userId, item.name);
          
          userData.commands.push(...projectData.commands);
          userData.events.push(...projectData.events);
          userData.projects.push(projectData.project);
        }
      }

      // Load data back into Supabase for active session
      await this.loadDataIntoSupabase(userData);
      
      return userData;
    } catch (error) {
      console.error('Error loading user data from GitHub:', error);
      return { commands: [], events: [], projects: [] };
    }
  },

  // Load specific project from GitHub
  async loadProjectFromGitHub(userId, projectFolder) {
    const dataUrl = `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/users/${userId}/${projectFolder}/data.json`;
    
    const response = await fetch(dataUrl, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const fileData = await response.json();
    const content = JSON.parse(atob(fileData.content));
    
    return content;
  },

  // Load data into Supabase for active session
  async loadDataIntoSupabase(userData) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/database/load-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`
      },
      body: JSON.stringify(userData)
    });

    return response.json();
  },

  // Save user project to GitHub with proper folder structure
  async saveProjectToGitHub(userId, projectId, projectData) {
    const filePath = `users/${userId}/project-${projectId}/data.json`;
    const content = btoa(JSON.stringify(projectData, null, 2));

    try {
      // Check if file exists to get current SHA
      let sha = null;
      try {
        const existingFile = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (existingFile.ok) {
          const fileData = await existingFile.json();
          sha = fileData.sha;
        }
      } catch (error) {
        // File doesn't exist, that's fine
      }

      // Create or update file
      const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update project ${projectId} for user ${userId}`,
          content: content,
          ...(sha && { sha })
        })
      });

      return response.json();
    } catch (error) {
      console.error('Error saving to GitHub:', error);
      throw error;
    }
  },

  // Manual "Save to GitHub" button functionality
  async manualSaveToGitHub(userId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/github/manual-save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ userId })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Data successfully saved to GitHub and cleared from temporary storage!');
      }
      
      return result;
    } catch (error) {
      console.error('Manual GitHub save failed:', error);
      alert('Failed to save to GitHub. Please try again.');
      throw error;
    }
  },

  // Get user's GitHub storage usage
  async getUserStorageInfo(userId) {
    try {
      const userFolderUrl = `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/users/${userId}`;
      
      const response = await fetch(userFolderUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.status === 404) {
        return { projects: 0, totalSize: 0 };
      }

      const folderContents = await response.json();
      const projectFolders = folderContents.filter(item => 
        item.type === 'dir' && item.name.startsWith('project-')
      );

      return {
        projects: projectFolders.length,
        totalSize: folderContents.reduce((sum, item) => sum + (item.size || 0), 0),
        lastUpdated: folderContents[0]?.updated_at || null
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { projects: 0, totalSize: 0 };
    }
  },

  // Helper to get auth token
  async getAuthToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  }
};

// Auto-check database size on app load
export const initializeDatabaseSystem = async () => {
  try {
    await githubDatabase.autoMigrateIfNeeded();
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// Periodic check for database size (every 10 minutes)
export const startDatabaseMonitoring = () => {
  setInterval(async () => {
    try {
      await githubDatabase.autoMigrateIfNeeded();
    } catch (error) {
      console.error('Database monitoring check failed:', error);
    }
  }, 10 * 60 * 1000); // 10 minutes
};
