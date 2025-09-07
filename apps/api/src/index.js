export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      if (path.startsWith('/api/auth')) {
        return handleAuth(request, env);
      } else if (path.startsWith('/api/projects')) {
        return handleProjects(request, env);
      } else if (path.startsWith('/api/bots')) {
        return handleBots(request, env);
      } else if (path.startsWith('/api/commands')) {
        return handleCommands(request, env);
      } else if (path.startsWith('/api/events')) {
        return handleEvents(request, env);
      } else if (path.startsWith('/api/marketplace')) {
        return handleMarketplace(request, env);
      } else if (path.startsWith('/api/discord')) {
        return handleDiscord(request, env);
      } else if (path.startsWith('/api/deploy')) {
        return handleDeploy(request, env);
      } else if (path.startsWith('/api/generate')) {
        return handleGenerate(request, env);
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Auth handlers
async function handleAuth(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth', '');
  
  if (path === '/me' && request.method === 'GET') {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }
    
    // Verify JWT token with Supabase
    const token = authHeader.replace('Bearer ', '');
    // Implementation depends on Supabase JWT verification
    return jsonResponse({ user: { id: 'user-id', email: 'user@example.com' } });
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Project handlers
async function handleProjects(request, env) {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  if (method === 'GET' && pathParts.length === 2) {
    // GET /api/projects - list user projects
    return jsonResponse({
      projects: [
        {
          id: 'project-1',
          name: 'My Discord Bot',
          description: 'A moderation bot for my server',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bots_count: 1,
          commands_count: 5,
          events_count: 3
        }
      ]
    });
  }
  
  if (method === 'POST' && pathParts.length === 2) {
    // POST /api/projects - create new project
    const body = await request.json();
    const project = {
      id: generateId(),
      name: body.name || 'Untitled Project',
      description: body.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bots: [],
      settings: {
        theme: 'dark',
        autoSave: true,
        collaboration: false
      }
    };
    
    return jsonResponse({ project }, 201);
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Bot handlers
async function handleBots(request, env) {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  if (method === 'GET' && pathParts.length === 2) {
    // GET /api/bots - list user bots
    return jsonResponse({
      bots: [
        {
          id: 'bot-1',
          name: 'My Moderation Bot',
          description: 'Keeps the server clean and organized',
          discord_client_id: null,
          discord_bot_token: null, // Never expose actual tokens
          status: 'offline',
          server_count: 0,
          commands_count: 0,
          events_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    });
  }
  
  if (method === 'POST' && pathParts.length === 2) {
    // POST /api/bots - create new bot
    const body = await request.json();
    const bot = {
      id: generateId(),
      name: body.name || 'Untitled Bot',
      description: body.description || '',
      discord_client_id: body.discord_client_id || null,
      status: 'offline',
      server_count: 0,
      commands: [],
      events: [],
      modules: [],
      settings: {
        prefix: '!',
        intents: ['GUILDS', 'GUILD_MESSAGES', 'MESSAGE_CONTENT'],
        permissions: []
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return jsonResponse({ bot }, 201);
  }
  
  if (method === 'PUT' && pathParts.length === 3) {
    // PUT /api/bots/{id} - update bot
    const botId = pathParts[2];
    const body = await request.json();
    
    // Update bot in database
    const updatedBot = {
      id: botId,
      ...body,
      updated_at: new Date().toISOString()
    };
    
    return jsonResponse({ bot: updatedBot });
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Discord integration handlers
async function handleDiscord(request, env) {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  if (pathParts[2] === 'invite' && method === 'POST') {
    // POST /api/discord/invite - generate Discord bot invite URL
    const body = await request.json();
    const { client_id, permissions = '8', guild_id } = body;
    
    if (!client_id) {
      return jsonResponse({ error: 'Client ID is required' }, 400);
    }
    
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&permissions=${permissions}&scope=bot%20applications.commands${guild_id ? `&guild_id=${guild_id}` : ''}`;
    
    return jsonResponse({ invite_url: inviteUrl });
  }
  
  if (pathParts[2] === 'validate' && method === 'POST') {
    // POST /api/discord/validate - validate Discord bot token
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return jsonResponse({ error: 'Token is required' }, 400);
    }
    
    try {
      // Validate token with Discord API
      const response = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
          'Authorization': `Bot ${token}`
        }
      });
      
      if (!response.ok) {
        return jsonResponse({ error: 'Invalid bot token' }, 400);
      }
      
      const botData = await response.json();
      return jsonResponse({
        valid: true,
        bot: {
          id: botData.id,
          username: botData.username,
          discriminator: botData.discriminator,
          avatar: botData.avatar
        }
      });
    } catch (error) {
      return jsonResponse({ error: 'Failed to validate token' }, 500);
    }
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Code generation handlers
async function handleGenerate(request, env) {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  if (pathParts[2] === 'bot' && method === 'POST') {
    // POST /api/generate/bot - generate bot code from project JSON
    const body = await request.json();
    const { project, bot } = body;
    
    if (!project || !bot) {
      return jsonResponse({ error: 'Project and bot data required' }, 400);
    }
    
    try {
      const generatedCode = await generateBotCode(project, bot);
      return jsonResponse({
        code: generatedCode,
        files: {
          'index.js': generatedCode.main,
          'package.json': generatedCode.package,
          'config.json': generatedCode.config,
          'commands/': generatedCode.commands,
          'events/': generatedCode.events
        }
      });
    } catch (error) {
      return jsonResponse({ error: 'Code generation failed' }, 500);
    }
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Command handlers
async function handleCommands(request, env) {
  const method = request.method;
  
  if (method === 'GET') {
    return jsonResponse({
      commands: [
        {
          id: 'cmd-1',
          name: 'ping',
          description: 'Check if the bot is responsive',
          type: 'slash',
          options: [],
          response: {
            type: 'message',
            content: 'Pong! 🏓'
          },
          created_at: new Date().toISOString()
        }
      ]
    });
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Event handlers
async function handleEvents(request, env) {
  const method = request.method;
  
  if (method === 'GET') {
    return jsonResponse({
      events: [
        {
          id: 'evt-1',
          name: 'Welcome Message',
          trigger: 'guildMemberAdd',
          conditions: [],
          actions: [
            {
              type: 'sendMessage',
              config: {
                channel: 'general',
                content: 'Welcome {{user.mention}} to the server!'
              }
            }
          ],
          created_at: new Date().toISOString()
        }
      ]
    });
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Marketplace handlers
async function handleMarketplace(request, env) {
  const method = request.method;
  
  if (method === 'GET') {
    return jsonResponse({
      items: [
        {
          id: 'mp-1',
          type: 'command',
          name: 'Advanced Moderation',
          description: 'Complete moderation command set',
          author: 'Vexryl Team',
          downloads: 1250,
          rating: 4.8,
          tags: ['moderation', 'admin', 'utility'],
          price: 0,
          created_at: new Date().toISOString()
        }
      ]
    });
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Deploy handlers
async function handleDeploy(request, env) {
  const method = request.method;
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  if (pathParts[2] === 'github' && method === 'POST') {
    // POST /api/deploy/github - deploy to GitHub
    const body = await request.json();
    const { project, repository } = body;
    
    // Generate code and push to GitHub
    // This would integrate with GitHub API
    return jsonResponse({
      deployment: {
        id: generateId(),
        status: 'pending',
        repository: repository,
        commit_sha: 'abc123',
        deploy_url: `https://github.com/${repository}/tree/main`,
        created_at: new Date().toISOString()
      }
    });
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Utility functions
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Code generation function
async function generateBotCode(project, bot) {
  const packageJson = {
    name: bot.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: bot.description,
    main: 'index.js',
    scripts: {
      start: 'node index.js',
      dev: 'nodemon index.js'
    },
    dependencies: {
      'discord.js': '^14.11.0',
      'dotenv': '^16.0.3'
    },
    devDependencies: {
      'nodemon': '^3.0.1'
    }
  };

  const mainCode = `
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Commands
const commands = [];

${bot.commands?.map(cmd => generateCommandCode(cmd)).join('\n\n') || ''}

// Events
${bot.events?.map(evt => generateEventCode(evt)).join('\n\n') || ''}

client.once('ready', async () => {
  console.log(\`Logged in as \${client.user.tag}!\`);
  
  // Register slash commands
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  
  try {
    console.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.DISCORD_TOKEN);
  `.trim();

  const configJson = {
    bot: {
      name: bot.name,
      description: bot.description,
      version: '1.0.0',
      permissions: bot.settings?.permissions || [],
      intents: bot.settings?.intents || []
    },
    commands: bot.commands || [],
    events: bot.events || []
  };

  return {
    main: mainCode,
    package: JSON.stringify(packageJson, null, 2),
    config: JSON.stringify(configJson, null, 2),
    commands: bot.commands || [],
    events: bot.events || []
  };
}

function generateCommandCode(command) {
  return `
// Command: ${command.name}
commands.push(
  new SlashCommandBuilder()
    .setName('${command.name}')
    .setDescription('${command.description}')
    .toJSON()
);

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  if (interaction.commandName === '${command.name}') {
    await interaction.reply('${command.response?.content || 'Command executed!'}');
  }
});
  `.trim();
}

function generateEventCode(event) {
  return `
// Event: ${event.name}
client.on('${event.trigger}', async (...args) => {
  // ${event.name} logic here
  console.log('Event triggered: ${event.name}');
});
  `.trim();
}
