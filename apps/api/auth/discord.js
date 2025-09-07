// /api/auth/discord.js
const { json, redirect } = require('wrangler');
const { getOrCreateDiscordUser } = require('../../utils/user');
const { createJWT } = require('../../utils/jwt');

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

export async function onRequestGet(context) {
  // Step 1: Redirect to Discord OAuth
  const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify email`;
  return redirect(url);
}

export async function onRequestPost(context) {
  // Step 2: Handle Discord OAuth callback
  const { code } = await context.request.json();
  if (!code) return json({ error: 'Missing code.' }, { status: 400 });
  // Exchange code for token
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
      scope: 'identify email',
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return json({ error: 'Discord auth failed.' }, { status: 401 });
  // Get user info
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const discordUser = await userRes.json();
  const user = await getOrCreateDiscordUser(discordUser);
  const jwt = createJWT(user.id);
  return json({ token: jwt, user });
}
