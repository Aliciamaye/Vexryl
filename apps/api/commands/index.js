import { Router } from 'itty-router';
import { validateToken } from '../auth/index.js';

const commandsRouter = Router({ base: '/api/commands' });

// Mock command storage
const commands = new Map();

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

// Get all commands for a user
commandsRouter.get('/', async (request) => {
  try {
    const user = requireAuth(request);
    const userCommands = Array.from(commands.values()).filter(cmd => cmd.userId === user.id);
    
    return new Response(JSON.stringify({ commands: userCommands }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Create a new command
commandsRouter.post('/', async (request) => {
  try {
    const user = requireAuth(request);
    const commandData = await request.json();
    
    if (!commandData.name) {
      return new Response(JSON.stringify({ error: 'Command name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check limit (15 commands per user)
    const userCommands = Array.from(commands.values()).filter(cmd => cmd.userId === user.id);
    if (userCommands.length >= 15) {
      return new Response(JSON.stringify({ error: 'Command limit reached (15 max)' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const command = {
      id: Date.now().toString(),
      userId: user.id,
      name: commandData.name,
      description: commandData.description || '',
      nodes: commandData.nodes || [],
      edges: commandData.edges || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    commands.set(command.id, command);

    return new Response(JSON.stringify({ success: true, command }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Update a command
commandsRouter.put('/:id', async (request) => {
  try {
    const user = requireAuth(request);
    const commandId = request.params.id;
    const commandData = await request.json();
    
    const command = commands.get(commandId);
    if (!command || command.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Command not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedCommand = {
      ...command,
      name: commandData.name || command.name,
      description: commandData.description || command.description,
      nodes: commandData.nodes || command.nodes,
      edges: commandData.edges || command.edges,
      updatedAt: new Date().toISOString()
    };

    commands.set(commandId, updatedCommand);

    return new Response(JSON.stringify({ success: true, command: updatedCommand }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Delete a command
commandsRouter.delete('/:id', async (request) => {
  try {
    const user = requireAuth(request);
    const commandId = request.params.id;
    
    const command = commands.get(commandId);
    if (!command || command.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Command not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    commands.delete(commandId);

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

// Test a command (mock)
commandsRouter.post('/:id/test', async (request) => {
  try {
    const user = requireAuth(request);
    const commandId = request.params.id;
    
    const command = commands.get(commandId);
    if (!command || command.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Command not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mock test result
    const testResult = {
      success: true,
      executionTime: Math.random() * 100 + 50,
      output: `Command "${command.name}" executed successfully`,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(testResult), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export function handleCommands(request) {
  return commandsRouter.handle(request);
}
