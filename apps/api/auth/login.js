// /api/auth/login.js
const { json } = require('wrangler');
const { getUserByEmail, verifyPassword } = require('../../utils/user');
const { createJWT } = require('../../utils/jwt');

export async function onRequestPost(context) {
  const { email, password } = await context.request.json();
  if (!email || !password) {
    return json({ error: 'Missing email or password.' }, { status: 400 });
  }
  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password))) {
    return json({ error: 'Invalid credentials.' }, { status: 401 });
  }
  const token = createJWT(user.id);
  return json({ token, user: { id: user.id, email: user.email, username: user.username } });
}
