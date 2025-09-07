/**
 * Real-time Collaboration Backend Service
 * WebSocket-based real-time collaboration for the visual bot builder
 */

import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'vexryl-secret-key';

app.use(cors());
app.use(express.json());

// In-memory storage (use Redis/Database in production)
const activeRooms = new Map();
const userSessions = new Map();
const botProjects = new Map();

// HTTP Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Authentication
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple auth (implement proper authentication in production)
  if (username && password) {
    const token = jwt.sign(
      { 
        userId: uuidv4(), 
        username,
        timestamp: Date.now()
      }, 
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      token,
      user: { username, userId: jwt.decode(token).userId }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Bot project CRUD
app.get('/api/bots/:botId', authenticateToken, (req, res) => {
  const { botId } = req.params;
  const bot = botProjects.get(botId);
  
  if (!bot) {
    return res.status(404).json({ error: 'Bot not found' });
  }
  
  res.json(bot);
});

app.post('/api/bots', authenticateToken, (req, res) => {
  const botId = uuidv4();
  const botData = {
    id: botId,
    name: req.body.name || 'New Bot',
    description: req.body.description || '',
    nodes: [],
    edges: [],
    variables: [],
    settings: {},
    owner: req.user.userId,
    collaborators: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  botProjects.set(botId, botData);
  res.json(botData);
});

app.put('/api/bots/:botId', authenticateToken, (req, res) => {
  const { botId } = req.params;
  const bot = botProjects.get(botId);
  
  if (!bot) {
    return res.status(404).json({ error: 'Bot not found' });
  }
  
  // Check permissions
  if (bot.owner !== req.user.userId && !bot.collaborators.includes(req.user.userId)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  const updatedBot = {
    ...bot,
    ...req.body,
    id: botId, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };
  
  botProjects.set(botId, updatedBot);
  
  // Broadcast changes to room
  broadcastToRoom(botId, {
    type: 'bot_updated',
    data: updatedBot,
    timestamp: Date.now()
  });
  
  res.json(updatedBot);
});

// Code generation endpoint
app.post('/api/bots/:botId/generate-code', authenticateToken, (req, res) => {
  const { botId } = req.params;
  const bot = botProjects.get(botId);
  
  if (!bot) {
    return res.status(404).json({ error: 'Bot not found' });
  }
  
  try {
    const code = generateDiscordBotCode(bot);
    res.json({ 
      success: true, 
      code,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Code generation failed', 
      message: error.message 
    });
  }
});

// Deployment endpoint (placeholder)
app.post('/api/bots/:botId/deploy', authenticateToken, (req, res) => {
  const { botId } = req.params;
  const bot = botProjects.get(botId);
  
  if (!bot) {
    return res.status(404).json({ error: 'Bot not found' });
  }
  
  // Simulate deployment
  const deploymentId = uuidv4();
  const deployment = {
    id: deploymentId,
    botId,
    status: 'pending',
    url: `https://discord.com/api/oauth2/authorize?client_id=${deploymentId}&permissions=8&scope=bot`,
    createdAt: new Date().toISOString()
  };
  
  // Simulate deployment process
  setTimeout(() => {
    deployment.status = 'deployed';
    broadcastToRoom(botId, {
      type: 'deployment_complete',
      data: deployment,
      timestamp: Date.now()
    });
  }, 3000);
  
  res.json(deployment);
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`🚀 Vexryl API Server running on port ${PORT}`);
});

// WebSocket Server for real-time collaboration
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      await handleWebSocketMessage(ws, data);
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });
  
  ws.on('close', () => {
    // Remove user from all rooms
    for (const [roomId, room] of activeRooms) {
      room.users = room.users.filter(user => user.ws !== ws);
      if (room.users.length === 0) {
        activeRooms.delete(roomId);
      } else {
        broadcastToRoom(roomId, {
          type: 'user_left',
          data: { userCount: room.users.length },
          timestamp: Date.now()
        });
      }
    }
  });
});

// WebSocket message handler
async function handleWebSocketMessage(ws, data) {
  const { type, payload } = data;
  
  switch (type) {
    case 'join_room':
      await handleJoinRoom(ws, payload);
      break;
      
    case 'leave_room':
      await handleLeaveRoom(ws, payload);
      break;
      
    case 'node_update':
      await handleNodeUpdate(ws, payload);
      break;
      
    case 'edge_update':
      await handleEdgeUpdate(ws, payload);
      break;
      
    case 'cursor_move':
      await handleCursorMove(ws, payload);
      break;
      
    case 'user_typing':
      await handleUserTyping(ws, payload);
      break;
      
    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: `Unknown message type: ${type}`
      }));
  }
}

// Room management
async function handleJoinRoom(ws, payload) {
  const { roomId, user } = payload;
  
  if (!activeRooms.has(roomId)) {
    activeRooms.set(roomId, {
      id: roomId,
      users: [],
      createdAt: Date.now()
    });
  }
  
  const room = activeRooms.get(roomId);
  
  // Add user to room
  const userSession = {
    ...user,
    ws,
    joinedAt: Date.now(),
    cursor: { x: 0, y: 0 },
    isActive: true
  };
  
  room.users.push(userSession);
  
  // Send current room state to new user
  ws.send(JSON.stringify({
    type: 'room_joined',
    data: {
      roomId,
      users: room.users.map(u => ({
        userId: u.userId,
        username: u.username,
        cursor: u.cursor,
        isActive: u.isActive
      }))
    }
  }));
  
  // Broadcast user joined to other users
  broadcastToRoom(roomId, {
    type: 'user_joined',
    data: {
      user: {
        userId: user.userId,
        username: user.username,
        cursor: { x: 0, y: 0 },
        isActive: true
      }
    },
    timestamp: Date.now()
  }, ws);
}

async function handleLeaveRoom(ws, payload) {
  const { roomId } = payload;
  const room = activeRooms.get(roomId);
  
  if (room) {
    room.users = room.users.filter(user => user.ws !== ws);
    
    if (room.users.length === 0) {
      activeRooms.delete(roomId);
    } else {
      broadcastToRoom(roomId, {
        type: 'user_left',
        data: { userCount: room.users.length },
        timestamp: Date.now()
      });
    }
  }
}

// Real-time updates
async function handleNodeUpdate(ws, payload) {
  const { roomId, node } = payload;
  
  broadcastToRoom(roomId, {
    type: 'node_updated',
    data: { node },
    timestamp: Date.now()
  }, ws);
}

async function handleEdgeUpdate(ws, payload) {
  const { roomId, edge } = payload;
  
  broadcastToRoom(roomId, {
    type: 'edge_updated',
    data: { edge },
    timestamp: Date.now()
  }, ws);
}

async function handleCursorMove(ws, payload) {
  const { roomId, cursor } = payload;
  const room = activeRooms.get(roomId);
  
  if (room) {
    const user = room.users.find(u => u.ws === ws);
    if (user) {
      user.cursor = cursor;
      
      broadcastToRoom(roomId, {
        type: 'cursor_moved',
        data: {
          userId: user.userId,
          cursor
        },
        timestamp: Date.now()
      }, ws);
    }
  }
}

async function handleUserTyping(ws, payload) {
  const { roomId, isTyping } = payload;
  const room = activeRooms.get(roomId);
  
  if (room) {
    const user = room.users.find(u => u.ws === ws);
    if (user) {
      broadcastToRoom(roomId, {
        type: 'user_typing',
        data: {
          userId: user.userId,
          username: user.username,
          isTyping
        },
        timestamp: Date.now()
      }, ws);
    }
  }
}

// Broadcast helper
function broadcastToRoom(roomId, message, excludeWs = null) {
  const room = activeRooms.get(roomId);
  if (!room) return;
  
  const messageStr = JSON.stringify(message);
  
  room.users.forEach(user => {
    if (user.ws !== excludeWs && user.ws.readyState === 1) {
      user.ws.send(messageStr);
    }
  });
}

// Code generation helper
function generateDiscordBotCode(bot) {
  // This would integrate with the CodeGenerator component logic
  // For now, return a simple template
  return `// Generated Discord.js Bot Code for: ${bot.name}
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log('Bot is ready!');
});

// Add your commands and events here
// Generated from ${bot.nodes?.length || 0} nodes and ${bot.edges?.length || 0} connections

client.login(process.env.DISCORD_TOKEN);
`;
}

export default app;
