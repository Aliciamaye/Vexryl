import { Router } from 'itty-router';

const authRouter = Router({ base: '/api/auth' });

// Mock user database (in production, use Supabase)
const users = new Map();
const tokens = new Map();

function generateToken() {
  return btoa(Math.random().toString(36).substring(2) + Date.now().toString(36));
}

function validateToken(token) {
  return tokens.get(token);
}

// Register
authRouter.post('/signup', async (request) => {
  try {
    const { email, password, username } = await request.json();
    
    if (!email || !password || !username) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (users.has(email)) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = {
      id: Date.now().toString(),
      email,
      username,
      password, // In production, hash this!
      createdAt: new Date().toISOString(),
      bots: []
    };

    users.set(email, user);
    const token = generateToken();
    tokens.set(token, user);

    return new Response(JSON.stringify({
      success: true,
      token,
      user: { id: user.id, email: user.email, username: user.username }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Login
authRouter.post('/login', async (request) => {
  try {
    const { email, password } = await request.json();
    
    const user = users.get(email);
    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = generateToken();
    tokens.set(token, user);

    return new Response(JSON.stringify({
      success: true,
      token,
      user: { id: user.id, email: user.email, username: user.username }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Discord OAuth (mock for demo)
authRouter.post('/discord', async (request) => {
  try {
    const { code } = await request.json();
    
    // Mock Discord user
    const discordUser = {
      id: 'discord_' + Date.now(),
      email: 'discord@example.com',
      username: 'DiscordUser#1234',
      avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      createdAt: new Date().toISOString(),
      bots: []
    };

    users.set(discordUser.email, discordUser);
    const token = generateToken();
    tokens.set(token, discordUser);

    return new Response(JSON.stringify({
      success: true,
      token,
      user: { 
        id: discordUser.id, 
        email: discordUser.email, 
        username: discordUser.username,
        avatar: discordUser.avatar
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Discord auth failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Verify token
authRouter.get('/verify', async (request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'No token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = authHeader.substring(7);
  const user = validateToken(token);
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    valid: true,
    user: { id: user.id, email: user.email, username: user.username }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

export function handleAuth(request) {
  return authRouter.handle(request);
}

export { validateToken, users };
