import { Router } from 'itty-router';
import { validateToken } from '../auth/index.js';

const eventsRouter = Router({ base: '/api/events' });

// Mock event storage
const events = new Map();

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

// Get all events for a user
eventsRouter.get('/', async (request) => {
  try {
    const user = requireAuth(request);
    const userEvents = Array.from(events.values()).filter(event => event.userId === user.id);
    
    return new Response(JSON.stringify({ events: userEvents }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Create a new event
eventsRouter.post('/', async (request) => {
  try {
    const user = requireAuth(request);
    const eventData = await request.json();
    
    if (!eventData.name || !eventData.eventType) {
      return new Response(JSON.stringify({ error: 'Event name and type are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check limit (10 events per user)
    const userEvents = Array.from(events.values()).filter(event => event.userId === user.id);
    if (userEvents.length >= 10) {
      return new Response(JSON.stringify({ error: 'Event limit reached (10 max)' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const event = {
      id: Date.now().toString(),
      userId: user.id,
      name: eventData.name,
      eventType: eventData.eventType,
      nodes: eventData.nodes || [],
      edges: eventData.edges || [],
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    events.set(event.id, event);

    return new Response(JSON.stringify({ success: true, event }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Update an event
eventsRouter.put('/:id', async (request) => {
  try {
    const user = requireAuth(request);
    const eventId = request.params.id;
    const eventData = await request.json();
    
    const event = events.get(eventId);
    if (!event || event.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Event not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedEvent = {
      ...event,
      name: eventData.name || event.name,
      eventType: eventData.eventType || event.eventType,
      nodes: eventData.nodes || event.nodes,
      edges: eventData.edges || event.edges,
      enabled: eventData.enabled !== undefined ? eventData.enabled : event.enabled,
      updatedAt: new Date().toISOString()
    };

    events.set(eventId, updatedEvent);

    return new Response(JSON.stringify({ success: true, event: updatedEvent }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Delete an event
eventsRouter.delete('/:id', async (request) => {
  try {
    const user = requireAuth(request);
    const eventId = request.params.id;
    
    const event = events.get(eventId);
    if (!event || event.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Event not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    events.delete(eventId);

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

// Test an event (mock)
eventsRouter.post('/:id/test', async (request) => {
  try {
    const user = requireAuth(request);
    const eventId = request.params.id;
    
    const event = events.get(eventId);
    if (!event || event.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Event not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mock test result
    const testResult = {
      success: true,
      triggered: true,
      executionTime: Math.random() * 200 + 100,
      output: `Event "${event.name}" (${event.eventType}) triggered successfully`,
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

// Toggle event enabled/disabled
eventsRouter.post('/:id/toggle', async (request) => {
  try {
    const user = requireAuth(request);
    const eventId = request.params.id;
    
    const event = events.get(eventId);
    if (!event || event.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Event not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    event.enabled = !event.enabled;
    event.updatedAt = new Date().toISOString();
    events.set(eventId, event);

    return new Response(JSON.stringify({ success: true, enabled: event.enabled }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export function handleEvents(request) {
  return eventsRouter.handle(request);
}
