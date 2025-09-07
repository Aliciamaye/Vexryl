import { Router } from 'itty-router';
import { validateToken } from '../auth/index.js';

const botsRouter = Router({ base: '/api/bots' });

// Mock bot storage
const bots = new Map();

function requireAuth(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  
  const token = authHeader.substring(7);
  const user = validateToken(token);
  if (!user) {
    throw new Error('Invalid token');
  }
  
  return user;
}

// Get all bots for a user
botsRouter.get('/', async (request) => {
  try {
    const user = requireAuth(request);
    const userBots = Array.from(bots.values()).filter(bot => bot.userId === user.id);
    
    return new Response(JSON.stringify({ bots: userBots }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Create a new bot
botsRouter.post('/', async (request) => {
  try {
    const user = requireAuth(request);
    const botData = await request.json();
    
    if (!botData.name) {
      return new Response(JSON.stringify({ error: 'Bot name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const bot = {
      id: Date.now().toString(),
      userId: user.id,
      name: botData.name,
      description: botData.description || '',
      token: botData.token || '',
      status: 'offline',
      avatar: botData.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png',
      settings: {
        prefix: botData.prefix || '!',
        status: botData.status || 'online',
        activity: botData.activity || 'Watching you code'
      },
      guilds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bots.set(bot.id, bot);

    return new Response(JSON.stringify({ success: true, bot }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Update bot settings
botsRouter.put('/:id', async (request) => {
  try {
    const user = requireAuth(request);
    const botId = request.params.id;
    const botData = await request.json();
    
    const bot = bots.get(botId);
    if (!bot || bot.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedBot = {
      ...bot,
      name: botData.name || bot.name,
      description: botData.description || bot.description,
      token: botData.token || bot.token,
      avatar: botData.avatar || bot.avatar,
      settings: {
        ...bot.settings,
        ...botData.settings
      },
      updatedAt: new Date().toISOString()
    };

    bots.set(botId, updatedBot);

    return new Response(JSON.stringify({ success: true, bot: updatedBot }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Start/Stop bot
botsRouter.post('/:id/:action', async (request) => {
  try {
    const user = requireAuth(request);
    const botId = request.params.id;
    const action = request.params.action;
    
    const bot = bots.get(botId);
    if (!bot || bot.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'start') {
      if (!bot.token) {
        return new Response(JSON.stringify({ error: 'Bot token is required to start' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      bot.status = 'online';
    } else if (action === 'stop') {
      bot.status = 'offline';
    } else if (action === 'restart') {
      bot.status = 'restarting';
      // Simulate restart delay
      setTimeout(() => {
        bot.status = 'online';
        bots.set(botId, bot);
      }, 2000);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    bot.updatedAt = new Date().toISOString();
    bots.set(botId, bot);

    return new Response(JSON.stringify({ success: true, status: bot.status }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Get bot statistics
botsRouter.get('/:id/stats', async (request) => {
  try {
    const user = requireAuth(request);
    const botId = request.params.id;
    
    const bot = bots.get(botId);
    if (!bot || bot.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mock statistics
    const stats = {
      guilds: Math.floor(Math.random() * 100) + 1,
      users: Math.floor(Math.random() * 10000) + 100,
      commands: Math.floor(Math.random() * 1000) + 10,
      uptime: bot.status === 'online' ? Math.floor(Math.random() * 86400) : 0,
      memory: Math.floor(Math.random() * 100) + 50,
      latency: Math.floor(Math.random() * 100) + 20
    };

    return new Response(JSON.stringify({ stats }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Delete bot
botsRouter.delete('/:id', async (request) => {
  try {
    const user = requireAuth(request);
    const botId = request.params.id;
    
    const bot = bots.get(botId);
    if (!bot || bot.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    bots.delete(botId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export function handleBots(request) {
  return botsRouter.handle(request);
}
