// Marketplace API endpoints
// Marketplace API endpoints
const sampleBuilds = [
  {
    id: '1',
    name: 'Welcome Command',
    description: 'Sends a welcome message when a user joins.',
    tags: ['event', 'welcome'],
    code: 'module.exports = { event: "guildMemberAdd", run: (client, member) => { member.send("Welcome!"); } }'
  },
  {
    id: '2',
    name: 'Moderation Tools',
    description: 'Basic moderation commands for your bot.',
    tags: ['moderation', 'commands'],
    code: 'module.exports = { command: "ban", run: (client, msg, args) => { /* ... */ } }'
  }
];

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // List marketplace builds
  if (path === '/api/marketplace' && method === 'GET') {
    // TODO: Replace with D1 query
    return new Response(JSON.stringify({ builds: sampleBuilds }), { status: 200 });
  }

  // Import a build to user's bots
  if (path === '/api/marketplace/import' && method === 'POST') {
    // TODO: Save build to user's bot data in D1
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  // Share a new build
  if (path === '/api/marketplace/share' && method === 'POST') {
    // TODO: Add new build to marketplace in D1
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response('Marketplace endpoint', { status: 200 });
}
