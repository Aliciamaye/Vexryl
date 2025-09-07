// Main Cloudflare Worker entry point
import { Router } from 'itty-router';
import { handleAuth } from './auth/index.js';
import { handleCommands } from './commands/index.js';
import { handleEvents } from './events/index.js';
import { handleBots } from './bots/index.js';
import { handleMarketplace } from './marketplace/index.js';

const router = Router();

// CORS handling
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

router.options('*', () => new Response(null, { headers: corsHeaders }));

// Routes
router.all('/api/auth/*', handleAuth);
router.all('/api/commands/*', handleCommands);  
router.all('/api/events/*', handleEvents);
router.all('/api/bots/*', handleBots);
router.all('/api/marketplace/*', handleMarketplace);

// Health check
router.get('/api/health', () => {
  return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// 404 handler
router.all('*', () => new Response('Not Found', { status: 404, headers: corsHeaders }));

export default {
  async fetch(request, env, ctx) {
    try {
      return router.handle(request, env, ctx).then(response => {
        // Add CORS headers to all responses
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return response;
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
