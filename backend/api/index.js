// Main entry for Cloudflare Worker API routing
import { onRequest as authHandler } from './auth.js';
import { onRequest as botsHandler } from './bots.js';
import { onRequest as marketplaceHandler } from './marketplace.js';
import { onRequest as modulesHandler } from './modules.js';
import { onRequest as usersHandler } from './users.js';
import { onRequest as hostingHandler } from '../hosting.js';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  if (path.startsWith('/api/auth')) return await authHandler(context);
  if (path.startsWith('/api/bots')) return await botsHandler(context);
  if (path.startsWith('/api/marketplace')) return await marketplaceHandler(context);
  if (path.startsWith('/api/modules')) return await modulesHandler(context);
  if (path.startsWith('/api/users')) return await usersHandler(context);
  if (path.startsWith('/api/hosting')) return await hostingHandler(context);

  return new Response('Not found', { status: 404 });
}
