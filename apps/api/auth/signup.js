// /api/auth/signup.js
const { json } = require('wrangler');
const { createUser, getUserByEmail } = require('../../utils/user');
const { createJWT } = require('../../utils/jwt');

export async function onRequestPost(context) {
  const { email, password, username } = await context.request.json();
  if (!email || !password || !username) {
    return json({ error: 'Missing fields.' }, { status: 400 });
  }
  if (await getUserByEmail(email)) {
    return json({ error: 'Email already in use.' }, { status: 409 });
  }
  const user = await createUser({ email, password, username });
  const token = createJWT(user.id);
  return json({ token, user: { id: user.id, email: user.email, username: user.username } });
}
