// Vexryl Platform API - Cloudflare Workers
import { createClient } from '@supabase/supabase-js';

// Environment variables (set in Cloudflare Workers dashboard)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Auth header
      const authHeader = request.headers.get('Authorization');
      if (authHeader) {
        supabase.auth.setAuth(authHeader.replace('Bearer ', ''));
      }

      // Route handlers
      if (path.startsWith('/api/commands')) {
        return handleCommands(request, method, path);
      } else if (path.startsWith('/api/events')) {
        return handleEvents(request, method, path);
      } else if (path.startsWith('/api/projects')) {
        return handleProjects(request, method, path);
      } else if (path.startsWith('/api/marketplace')) {
        return handleMarketplace(request, method, path);
      } else if (path.startsWith('/api/snapshots')) {
        return handleSnapshots(request, method, path);
      } else if (path.startsWith('/api/github')) {
        return handleGitHub(request, method, path);
      } else if (path.startsWith('/api/database')) {
        return handleDatabase(request, method, path);
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Commands API
async function handleCommands(request, method, path) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  switch (method) {
    case 'GET':
      const { data: commands, error: getError } = await supabase
        .from('commands')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (getError) throw getError;
      return jsonResponse(commands);

    case 'POST':
      const commandData = await request.json();
      const { data: newCommand, error: postError } = await supabase
        .from('commands')
        .insert({
          ...commandData,
          user_id: user.id,
          project_id: commandData.project_id || null
        })
        .select()
        .single();

      if (postError) throw postError;
      return jsonResponse(newCommand, 201);

    case 'PUT':
      const commandId = path.split('/').pop();
      const updateData = await request.json();
      const { data: updatedCommand, error: putError } = await supabase
        .from('commands')
        .update(updateData)
        .eq('id', commandId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (putError) throw putError;
      return jsonResponse(updatedCommand);

    case 'DELETE':
      const deleteId = path.split('/').pop();
      const { error: deleteError } = await supabase
        .from('commands')
        .delete()
        .eq('id', deleteId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      return jsonResponse({ success: true });

    default:
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }
}

// Events API
async function handleEvents(request, method, path) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  switch (method) {
    case 'GET':
      const { data: events, error: getError } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (getError) throw getError;
      return jsonResponse(events);

    case 'POST':
      const eventData = await request.json();
      const { data: newEvent, error: postError } = await supabase
        .from('events')
        .insert({
          ...eventData,
          user_id: user.id,
          project_id: eventData.project_id || null
        })
        .select()
        .single();

      if (postError) throw postError;
      return jsonResponse(newEvent, 201);

    case 'PUT':
      const eventId = path.split('/').pop();
      const updateData = await request.json();
      const { data: updatedEvent, error: putError } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (putError) throw putError;
      return jsonResponse(updatedEvent);

    case 'DELETE':
      const deleteId = path.split('/').pop();
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', deleteId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      return jsonResponse({ success: true });

    default:
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }
}

// Projects API
async function handleProjects(request, method, path) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  switch (method) {
    case 'GET':
      const { data: projects, error: getError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (getError) throw getError;
      return jsonResponse(projects);

    case 'POST':
      const projectData = await request.json();
      const { data: newProject, error: postError } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          user_id: user.id
        })
        .select()
        .single();

      if (postError) throw postError;
      return jsonResponse(newProject, 201);

    default:
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }
}

// GitHub Export & Database Management API
async function handleGitHub(request, method, path) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  if (method === 'POST' && path.includes('/manual-save')) {
    const { userId } = await request.json();
    
    // Get all user data from Supabase
    const userData = await getAllUserData(userId);
    
    // Save to GitHub with user folder structure
    await saveUserDataToGitHub(userId, userData);
    
    // Clear user data from Supabase after successful GitHub save
    await clearUserDataFromSupabase(userId);

    return jsonResponse({ 
      success: true, 
      message: 'Data saved to GitHub and cleared from temporary storage',
      savedProjects: userData.projects.length,
      savedCommands: userData.commands.length,
      savedEvents: userData.events.length
    });
  }

  if (method === 'POST' && path.includes('/export')) {
    const { projectId } = await request.json();
    
    // Get project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError) throw projectError;

    // Get all commands and events for this project
    const { data: commands } = await supabase
      .from('commands')
      .select('*')
      .eq('project_id', projectId);

    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('project_id', projectId);

    // Create GitHub export data with user folder structure
    const exportData = {
      project,
      commands,
      events,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    // Save to GitHub in user's folder
    await saveProjectToGitHub(user.id, projectId, exportData);
    
    // After successful GitHub push, delete from Supabase
    await deleteProjectData(projectId, user.id);

    return jsonResponse({ 
      success: true, 
      message: 'Project exported to GitHub and removed from platform',
      githubPath: `users/${user.id}/project-${projectId}/data.json`
    });
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
}

// Database Management API
async function handleDatabase(request, method, path) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  if (method === 'GET' && path.includes('/size')) {
    // Get current database size
    const { data, error } = await supabase
      .rpc('get_database_size');

    if (error) throw error;

    return jsonResponse({ 
      size_mb: Math.round((data || 0) / 1024 / 1024 * 100) / 100 
    });
  }

  if (method === 'POST' && path.includes('/migrate-all')) {
    // Auto-migrate all users when database hits size limit
    const migratedUsers = await migrateAllUsersToGitHub();
    
    return jsonResponse({
      success: true,
      message: 'Auto-migration completed',
      migratedUsers: migratedUsers.length,
      freedSpace: '~300MB'
    });
  }

  if (method === 'POST' && path.includes('/load-session')) {
    // Load user data from GitHub back into Supabase for active session
    const userData = await request.json();
    
    // Insert data into Supabase for active session
    await loadDataIntoSupabase(user.id, userData);
    
    return jsonResponse({
      success: true,
      message: 'User data loaded from GitHub into active session'
    });
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
}

// GitHub Operations
async function saveUserDataToGitHub(userId, userData) {
  const GITHUB_TOKEN = env.GITHUB_TOKEN;
  const GITHUB_REPO = 'vexryl-database';
  const GITHUB_OWNER = env.GITHUB_REPO_OWNER;

  // Group data by projects
  const projectGroups = {};
  
  // Group commands by project
  userData.commands.forEach(cmd => {
    const projectId = cmd.project_id || 'standalone';
    if (!projectGroups[projectId]) {
      projectGroups[projectId] = { commands: [], events: [], project: null };
    }
    projectGroups[projectId].commands.push(cmd);
  });

  // Group events by project
  userData.events.forEach(evt => {
    const projectId = evt.project_id || 'standalone';
    if (!projectGroups[projectId]) {
      projectGroups[projectId] = { commands: [], events: [], project: null };
    }
    projectGroups[projectId].events.push(evt);
  });

  // Add project data
  userData.projects.forEach(project => {
    if (projectGroups[project.id]) {
      projectGroups[project.id].project = project;
    }
  });

  // Save each project to GitHub
  for (const [projectId, projectData] of Object.entries(projectGroups)) {
    await saveProjectToGitHub(userId, projectId, projectData);
  }
}

async function saveProjectToGitHub(userId, projectId, projectData) {
  const GITHUB_TOKEN = env.GITHUB_TOKEN;
  const GITHUB_REPO = 'vexryl-database';
  const GITHUB_OWNER = env.GITHUB_REPO_OWNER;
  
  const filePath = `users/${userId}/project-${projectId}/data.json`;
  const content = btoa(JSON.stringify(projectData, null, 2));

  // Check if file exists
  let sha = null;
  try {
    const existingFileResponse = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (existingFileResponse.ok) {
      const fileData = await existingFileResponse.json();
      sha = fileData.sha;
    }
  } catch (error) {
    // File doesn't exist, that's fine
  }

  // Create or update file
  const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`, {
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
}

async function getAllUserData(userId) {
  const [
    { data: projects },
    { data: commands },
    { data: events }
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('user_id', userId),
    supabase.from('commands').select('*').eq('user_id', userId),
    supabase.from('events').select('*').eq('user_id', userId)
  ]);

  return { projects: projects || [], commands: commands || [], events: events || [] };
}

async function clearUserDataFromSupabase(userId) {
  // Delete user data in order due to foreign key constraints
  await supabase.from('commands').delete().eq('user_id', userId);
  await supabase.from('events').delete().eq('user_id', userId);
  await supabase.from('snapshots').delete().eq('user_id', userId);
  await supabase.from('projects').delete().eq('user_id', userId);
}

async function migrateAllUsersToGitHub() {
  // Get all users with data
  const { data: users } = await supabase
    .from('users')
    .select('id');

  const migratedUsers = [];

  for (const user of users || []) {
    try {
      const userData = await getAllUserData(user.id);
      
      if (userData.projects.length > 0 || userData.commands.length > 0 || userData.events.length > 0) {
        await saveUserDataToGitHub(user.id, userData);
        await clearUserDataFromSupabase(user.id);
        migratedUsers.push(user.id);
      }
    } catch (error) {
      console.error(`Failed to migrate user ${user.id}:`, error);
    }
  }

  return migratedUsers;
}

async function loadDataIntoSupabase(userId, userData) {
  // Load projects
  if (userData.projects?.length) {
    await supabase.from('projects').insert(
      userData.projects.map(p => ({ ...p, user_id: userId }))
    );
  }

  // Load commands  
  if (userData.commands?.length) {
    await supabase.from('commands').insert(
      userData.commands.map(c => ({ ...c, user_id: userId }))
    );
  }

  // Load events
  if (userData.events?.length) {
    await supabase.from('events').insert(
      userData.events.map(e => ({ ...e, user_id: userId }))
    );
  }
}

// Delete project data after GitHub export
async function deleteProjectData(projectId, userId) {
  // Delete in order due to foreign key constraints
  await supabase.from('commands').delete().eq('project_id', projectId).eq('user_id', userId);
  await supabase.from('events').delete().eq('project_id', projectId).eq('user_id', userId);
  await supabase.from('snapshots').delete().eq('project_id', projectId).eq('user_id', userId);
  await supabase.from('projects').delete().eq('id', projectId).eq('user_id', userId);
}

// Marketplace API
async function handleMarketplace(request, method, path) {
  switch (method) {
    case 'GET':
      const { data: items, error: getError } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('is_public', true)
        .order('downloads', { ascending: false });

      if (getError) throw getError;
      return jsonResponse(items);

    default:
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }
}

// Snapshots API
async function handleSnapshots(request, method, path) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  switch (method) {
    case 'POST':
      const snapshotData = await request.json();
      const { data: newSnapshot, error: postError } = await supabase
        .from('snapshots')
        .insert({
          ...snapshotData,
          user_id: user.id
        })
        .select()
        .single();

      if (postError) throw postError;
      return jsonResponse(newSnapshot, 201);

    default:
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }
}

// Helper function
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
